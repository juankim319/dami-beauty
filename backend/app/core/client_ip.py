from fastapi import Request


def get_client_ip(request: Request) -> str:
    """Resolve client IP for PayTR (requires real IP, not 127.0.0.1 behind proxy)."""
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip", "")
    if real_ip:
        return real_ip.strip()
    if request.client:
        return request.client.host
    return "127.0.0.1"
