import logging

def create_logger(name: str = "modal_app"):
    class LogColors:
        BLUE = "\033[94m"
        WHITE = "\033[97m"
        RED = "\033[91m"
        YELLOW = "\033[93m"
        GREEN = "\033[92m"
        RESET = "\033[0m"

    class CustomFormatter(logging.Formatter):
        FORMATS = {
            logging.DEBUG: LogColors.WHITE + "[DEBUG] %(message)s" + LogColors.RESET,
            logging.INFO: LogColors.BLUE + "[INFO] %(message)s" + LogColors.RESET,
            logging.WARNING: LogColors.YELLOW + "[WARNING] %(message)s" + LogColors.RESET,
            logging.ERROR: LogColors.RED + "[ERROR] %(message)s" + LogColors.RESET,
            logging.CRITICAL: LogColors.RED + "[CRITICAL] %(message)s" + LogColors.RESET,
            "SUCCESS": LogColors.GREEN + "[SUCCESS] %(message)s" + LogColors.RESET,
        }

        def format(self, record):
            fmt = self.FORMATS.get(record.levelno, self.FORMATS[logging.INFO])
            if hasattr(record, "success") and getattr(record, "success", False):
                fmt = self.FORMATS["SUCCESS"]
            formatter = logging.Formatter(fmt)
            return formatter.format(record)

    class SuccessLogger(logging.Logger):
        def success(self, msg, *args, **kwargs):
            if self.isEnabledFor(logging.INFO):
                extra = kwargs.pop("extra", {})
                extra["success"] = True
                self._log(logging.INFO, msg, args, extra=extra, **kwargs)

    logging.setLoggerClass(SuccessLogger)

    logger = logging.getLogger(name)
    handler = logging.StreamHandler()
    handler.setFormatter(CustomFormatter())
    if not logger.hasHandlers():
        logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)
    # Allow code to continue using logging.getLogger(__name__)
    return logger
