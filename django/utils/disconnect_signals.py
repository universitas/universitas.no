from contextlib import contextmanager
import ctypes

from django.db.models import signals


@contextmanager
def disconnect_django_signals():
    """ Temporarily disconnect all signals """
    signals_list = []
    for signal_name in dir(signals):
        signal = getattr(signals, signal_name)
        if not isinstance(signal, signals.Signal):
            continue
        for (receiver_id, sender_id), recref in signal.receivers[:]:
            receiver = recref()
            sender = ctypes.cast(sender_id, ctypes.py_object).value
            signals_list.append([signal, receiver, sender])

    try:
        for signal, receiver, sender in signals_list:
            signal.disconnect(receiver, sender=sender)
        yield
    finally:
        for signal, receiver, sender in signals_list:
            signal.connect(receiver, sender=sender)
