import { DashboardHook } from "@/components/context/Dashboardprovider";
import HandleAxiosErrors from "@/components/HandleAxiosErrors";
import { LoginApi, Services } from "@/actions/sdk.gen";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationInstance } from "antd/es/notification/interface";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  CheckSessionActiveStatus,
  ConversationUpdatingProps,
  handleFriendRequestI,
  logoutProps,
  registerProps,
  sendFriendRequest,
  UpdateProfilePicture,
} from "@/types";
import { signOut } from "next-auth/react";

export class Mutations {
  public static UseRegister = (api: NotificationInstance) => {
    const login = Mutations.useLogin(api, false);
    const { setIsLoading } = DashboardHook();

    return useMutation({
      mutationFn: async (registerData: registerProps) =>
        await Services.register(registerData),
      onMutate: () => {
        setIsLoading(true);
      },
      onError: (error) => {
        HandleAxiosErrors({ api: api, error: error });
        setIsLoading(false);
      },
      onSuccess: async (response, variables) => {
        if (response)
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 2000,
          });

        const email = variables.email;
        const password = variables.password;

        await login.mutateAsync({ email, password });

        setIsLoading(false);
      },
    });
  };

  public static useLogin = (api: NotificationInstance, loginState: boolean) => {
    const { setIsLoading } = DashboardHook();
    const router = useRouter();
    return useMutation({
      mutationFn: LoginApi,
      onMutate: () => {
        setIsLoading(true);
      },
      onError: async (error) => {
        setIsLoading(false);
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response) => {
        if (loginState) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Logged in successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        router.push("/dashboard");
        setIsLoading(false);
      },
    });
  };

  public static useSendFriendRequest = (api: NotificationInstance) => {
    const { setIsLoading } = DashboardHook();
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, friendId }: sendFriendRequest) =>
        Services.sendFriendRequest({ id, friendId }),
      onMutate: () => {
        setIsLoading(true);
      },
      onError: async (error) => {
        setIsLoading(false);
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response) => {
        api.success({
          message: response.message,
        });
        setIsLoading(false);
      },
    });
  };

  public static useHandleFriendRequest = (api: NotificationInstance) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, friendId, acception }: handleFriendRequestI) =>
        Services.handleFriendRequest({ id, friendId, acception }),
      onMutate: () => {},
      onError: async (error) => {
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response) => {
        api.success({
          message: response.message,
        });
        // await queryClient.invalidateQueries({
        //   queryKey: ["multipleQueries-friendRequests"],
        // });
        // await queryClient.invalidateQueries({
        //   queryKey: ["multipleQueries-friends"],
        // });
      },
    });
  };

  public static useUpdateProfilePicture = (api: NotificationInstance) => {
    const { setIsLoading } = DashboardHook();
    return useMutation({
      mutationFn: ({ id, profileImg }: UpdateProfilePicture) =>
        Services.updateProfilePicture({ id, profileImg }),
      onMutate: () => {
        setIsLoading(true);
      },
      onError: async (error) => {
        setIsLoading(false);
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response) => {
        api.success({
          message: response.message,
        });
        setIsLoading(false);
      },
    });
  };

  public static useUpdateConversation = (api: NotificationInstance) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, recipientId, content }: ConversationUpdatingProps) =>
        Services.CreateOrUpdateAConversation({ id, recipientId, content }),
      onMutate: () => {},
      onError: async (error) => {
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response, variables) => {
        if (response.count <= 1) {
          console.log("hereee");
          await queryClient.invalidateQueries({
            queryKey: [`conversation-${variables.recipientId}`],
          });
        }
      },
    });
  };

  public static useLogout = (api: NotificationInstance) => {
    const router = useRouter();
    return useMutation({
      mutationFn: ({ id }: logoutProps) => Services.logout({ id }),
      onError: async (error) => {
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response) => {
        router.push("/");
        signOut();
      },
    });
  };

  public static useCheckSession = (api: NotificationInstance) => {
    return useMutation({
      mutationFn: ({ friendId }: CheckSessionActiveStatus) =>
        Services.checkActiveSession({ friendId }),
      onError: async (error) => {
        HandleAxiosErrors({ api, error });
      },
    });
  };
}
