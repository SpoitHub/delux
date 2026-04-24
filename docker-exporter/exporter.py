import docker
import os
from prometheus_client import start_http_server, Counter, Gauge, CollectorRegistry
import time

# Create a registry
registry = CollectorRegistry()

# Define metrics
container_state = Gauge('docker_container_state', 'Docker container state (1=running, 0=stopped, -1=error)', 
                        ['container_name', 'container_id', 'ports'], registry=registry)
container_info = Gauge('docker_container_info', 'Docker container info',
                       ['container_name', 'container_id', 'ports', 'status'], registry=registry)

def get_container_ports(container):
    """Extract ports from container"""
    ports = []
    if container.ports:
        for port_key, port_list in container.ports.items():
            if port_list:
                for port_info in port_list:
                    host_port = port_info.get('HostPort', '')
                    if host_port:
                        ports.append(f"{host_port}:{port_key}")
    return ','.join(ports) if ports else 'no-ports'

def get_container_status(container):
    """Get container status: running (1), stopped (0), error (-1)"""
    state = container.status
    if state == 'running':
        return 1, 'Запущен'
    elif state == 'exited':
        return 0, 'Не запущен'
    elif state == 'created' or state == 'restarting':
        return 0, 'Перезагрузка'
    else:
        return -1, 'Ошибка'

def update_metrics():
    """Update metrics from Docker daemon"""
    try:
        client = docker.from_env()
        containers = client.containers.list(all=True)
        
        for container in containers:
            # Skip non-delux containers
            if not container.name.startswith('delux_'):
                continue
                
            ports = get_container_ports(container)
            state, status_text = get_container_status(container)
            
            # Update metrics
            container_state.labels(
                container_name=container.name,
                container_id=container.short_id,
                ports=ports
            ).set(state)
            
            container_info.labels(
                container_name=container.name,
                container_id=container.short_id,
                ports=ports,
                status=status_text
            ).set(state)
            
            print(f"Updated: {container.name} ({ports}) - {status_text}")
    except Exception as e:
        print(f"Error updating metrics: {e}")

if __name__ == '__main__':
    # Start HTTP server on port 8888
    start_http_server(8888, registry=registry)
    print("Docker exporter started on port 8888")
    
    # Update metrics every 5 seconds
    while True:
        update_metrics()
        time.sleep(5)
