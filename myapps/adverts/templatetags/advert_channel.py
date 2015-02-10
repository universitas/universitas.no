""" Tags for placement of ad channels in templates. """

import logging
from django import template
from ..models import AdChannel, Advert

register = template.Library()
logger = logging.getLogger('universitas')

@register.inclusion_tag('_advert-channel.html', takes_context=True)
def advert(context, channel_name):
    logger.debug('args = {}'.format(channel_name))
    channel, new = AdChannel.objects.get_or_create(name=channel_name)
    if new:
        # no channel with that name exists.
        dummy_ad = Advert()
        dummy_ad.ad_channels.add(channel)
        dummy_ad.status = Advert.DEFAULT
        dummy_ad.save()

        channel.description = 'autocreate'
        logger.warning('Template requests unkown ad channel '+ channel_name)
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
