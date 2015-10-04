""" Tags for placement of ad channels in templates. """

import logging
from django import template
from ..models import AdChannel, Advert, AdFormat

register = template.Library()
logger = logging.getLogger(__name__)


@register.inclusion_tag('_advert-channel.html', takes_context=True)
def advert(context, channel_name):
    channel, new = AdChannel.objects.get_or_create(name=channel_name)
    if new:
        adformat = AdFormat.objects.order_by('?').first()
        dummy_ad = Advert.objects.create_dummy(adformat)
        dummy_ad.status = Advert.PUBLISHED
        dummy_ad.ad_channels.add(channel)
        channel.ad_formats.add(adformat)
        dummy_ad.save()
        channel.description = 'autocreate'
        logger.warning('Template requests unknown ad channel ' + channel_name)
        channel.save()

    new_ads = channel.serve_ads()
    session = context.get('session')
    if session:
        seen_ads = session.get('seen_ads', [])
        for ad in new_ads:
            seen_ads.remove(ad.id)
            seen_ads.append(ad.id)
        session['seen_ads'] = seen_ads

    channel_context = {
        "ads": new_ads,
        "channel": channel,
    }
    return channel_context
