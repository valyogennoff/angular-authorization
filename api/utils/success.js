export const CreateSuccess = (status, message, data) => {
    const successObj = {
        status,
        message,
        data,
    }
    return successObj;
}