export class ValidationError extends Error {
}
export const handleError = (err, req, res, next) => {
    console.log(err);
    res
        .status(err instanceof ValidationError ? 400 : 500)
        .json({
        message: err instanceof ValidationError ? err.message : 'Sorry for unexpected error, just try again later.',
    });
};
//# sourceMappingURL=errrors.js.map