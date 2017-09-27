import ctypes
import inspect
import logging

from django.db.models import Model, signals

logger = logging.getLogger(__name__)


def disconnect_signals(verbose=False):
    """ Disconnects all signals. """
    for signal_name in dir(signals):
        signal = getattr(signals, signal_name)
        if not isinstance(signal, signals.Signal):
            continue
        for (receiver_id, sender_id), recref in signal.receivers[:]:
            receiver = recref()
            sender = ctypes.cast(sender_id, ctypes.py_object).value
            signal.disconnect(receiver, sender=sender)
            if not verbose:
                continue
            if inspect.isclass(sender) and issubclass(sender, Model):
                sender_name = f'{sender.__module__}.{sender.__name__}'
            else:
                sender_name = f'{sender}'
            logger.debug(
                f'{sender_name:<35}{receiver.__module__}'
                f'.{receiver.__qualname__}'
            )
