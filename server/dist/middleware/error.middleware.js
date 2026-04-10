export function errorHandler(error, _req, res, _next) {
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
    }
    res.status(500).json({ message: 'Internal server error' });
}
