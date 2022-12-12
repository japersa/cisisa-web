export const definePermission = (payload) => ({
    type: "DEFINE_PERMISSIONS",
    payload
});

export const resetPermission = () => ({
    type: "RESET_PERMISSIONS",
    payload: {}
});