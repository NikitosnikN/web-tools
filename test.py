def factorial(n):
    """Compute the factorial of a non-negative integer n."""
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

