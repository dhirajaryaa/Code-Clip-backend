export const AsyncHandler = (requestedFunction) => {
    return (
        (req, res, next) => Promise.resolve(requestedFunction(req, res, next)).catch((err) => next(err))
    );
}