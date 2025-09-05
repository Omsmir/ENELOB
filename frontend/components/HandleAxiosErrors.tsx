import { ApiError } from '@/core/ApiError';
import { NotificationInstance } from 'antd/es/notification/interface';
import axios from 'axios';

const HandleAxiosErrors = ({ api, error }: { api: NotificationInstance; error: Error }) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            api.error({
                message: `${error.response.data.message}`,
                description: 'something went wrong',
                pauseOnHover: false,
            });
        } else {
            api.error({
                message: 'No Response from Server',
                description: 'Please check your network connection or try again later.',
                pauseOnHover: false,
            });
        }
    } else if (error instanceof Error) {
        api.error({
            message: 'Something went wrong',
            description: error.message,
            pauseOnHover: false,
        });
    }
};

export default HandleAxiosErrors;
