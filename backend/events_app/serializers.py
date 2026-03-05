import json
from rest_framework import serializers
from .models import Event, EventLocation, OnlineInfo, TicketType


class EventLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLocation
        fields = ['city', 'address']


class OnlineInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlineInfo
        fields = ['url', 'platform']


class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id', 'name', 'price', 'quantity_total', 'quantity_sold']
        read_only_fields = ['id', 'quantity_sold']


class TicketTypeWriteSerializer(serializers.Serializer):
    """Used inside EventWriteSerializer to handle create/update by optional id."""
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_total = serializers.IntegerField(min_value=1)


class OrganizerShortSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    company_name = serializers.CharField()


class EventSerializer(serializers.ModelSerializer):
    location = EventLocationSerializer(read_only=True)
    online_info = OnlineInfoSerializer(read_only=True)
    ticket_types = TicketTypeSerializer(many=True, read_only=True)
    organizer = OrganizerShortSerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'format',
            'start_datetime', 'end_datetime',
            'is_free', 'status',
            'location', 'online_info', 'ticket_types',
            'organizer', 'image',
            'created_at', 'updated_at',
        ]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class EventWriteSerializer(serializers.ModelSerializer):
    location = EventLocationSerializer(required=False, allow_null=True)
    online_info = OnlineInfoSerializer(required=False, allow_null=True)
    ticket_types = TicketTypeWriteSerializer(many=True, required=False)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = [
            'title', 'description', 'format',
            'start_datetime', 'end_datetime',
            'is_free', 'status',
            'location', 'online_info', 'ticket_types', 'image',
        ]

    def to_internal_value(self, data):
        """
        When the request comes as multipart/form-data (file upload),
        nested objects arrive as JSON strings — parse them here.

        IMPORTANT: we must convert to a plain dict (not QueryDict) before
        calling super(), otherwise DRF's ListSerializer.get_value() detects
        the QueryDict via hasattr(data, 'getlist') and uses parse_html_list()
        which expects keys like 'ticket_types[0]name' instead of a Python list,
        causing ticket_types to always be treated as empty.
        """
        # Flatten to a plain dict so DRF uses dict.get() for every field,
        # including the many=True ticket_types serializer.
        if hasattr(data, 'getlist'):
            # QueryDict / DataAndFiles — dict(data.items()) picks last value per key
            plain: dict = dict(data.items())
        else:
            plain = dict(data)

        # Parse JSON-encoded nested fields sent as strings via FormData
        for field in ('location', 'online_info', 'ticket_types'):
            val = plain.get(field)
            if isinstance(val, str):
                try:
                    plain[field] = json.loads(val)
                except (ValueError, TypeError):
                    pass
        return super().to_internal_value(plain)

    # ── create ──────────────────────────────────────────────────────────────

    def create(self, validated_data):
        location_data = validated_data.pop('location', None)
        online_info_data = validated_data.pop('online_info', None)
        ticket_types_data = validated_data.pop('ticket_types', [])

        location = EventLocation.objects.create(**location_data) if location_data else None
        online_info = OnlineInfo.objects.create(**online_info_data) if online_info_data else None

        event = Event.objects.create(
            location=location,
            online_info=online_info,
            **validated_data,
        )
        for tt in ticket_types_data:
            tt.pop('id', None)
            TicketType.objects.create(event=event, **tt)
        return event

    # ── update ──────────────────────────────────────────────────────────────

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        online_info_data = validated_data.pop('online_info', None)
        ticket_types_data = validated_data.pop('ticket_types', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update / create location
        if location_data is not None:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                loc = EventLocation.objects.create(**location_data)
                instance.location = loc
                instance.save(update_fields=['location'])

        # Update / create online_info
        if online_info_data is not None:
            if instance.online_info:
                for attr, value in online_info_data.items():
                    setattr(instance.online_info, attr, value)
                instance.online_info.save()
            else:
                oi = OnlineInfo.objects.create(**online_info_data)
                instance.online_info = oi
                instance.save(update_fields=['online_info'])

        # Upsert ticket types
        if ticket_types_data is not None:
            for tt_data in ticket_types_data:
                tt_id = tt_data.pop('id', None)
                if tt_id:
                    TicketType.objects.filter(id=tt_id, event=instance).update(**tt_data)
                else:
                    TicketType.objects.create(event=instance, **tt_data)

        return instance
