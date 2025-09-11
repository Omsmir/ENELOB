import { DashboardHook } from "@/components/context/Dashboardprovider";
import HandleAxiosErrors from "@/components/HandleAxiosErrors";
import { Services } from "@/actions/sdk.gen";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationInstance } from "antd/es/notification/interface";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  CheckSessionActiveStatus,
  ConversationUpdatingProps,
  handleFriendRequestI,
  Login,
  logoutProps,
  registerProps,
  reIssueAccessTokenProps,
  sendFriendRequest,
  UpdateProfilePicture,
} from "@/types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { logout, setUserSession } from "@/components/store/slices/AuthReducer";
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
    const dispatch = useDispatch();

    const router = useRouter();
    return useMutation({
      mutationFn: ({ email, password }: Login) =>
        Services.login({ email, password }),
      onMutate: () => {
        setIsLoading(true);
      },
      onError: async (error) => {
        setIsLoading(false);
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response) => {
        const decodedToken = jwt.decode(response.accessToken) as JwtPayload;

        const session = {
          email: decodedToken?.email,
          expiresAt: decodedToken?.exp && decodedToken.exp * 1000,
          _id: decodedToken?._id,
          full_name: decodedToken?.full_name,
          profileImg: decodedToken?.profileImg.url,
          verified: decodedToken?.verified,
          accessToken: response.accessToken,
          lastSeenAt: decodedToken.lastSeenAt,
        };

        dispatch(setUserSession(session));

        console.log(response);

        if (loginState) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.message || "logged in successfully",
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
        Services.CreateOrUpdateAConversation({
          id,
          recipientId,
          content,
        }),
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
    const dispatch = useDispatch();
    return useMutation({
      mutationFn: ({ id }: logoutProps) => Services.logout({ id }),
      onError: async (error) => {
        HandleAxiosErrors({ api, error });
      },
      onSuccess: async (response) => {
        router.push("/");
        dispatch(logout());
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


  public static useReissueAccessToken = (api: NotificationInstance) => {
    return useMutation({
      mutationFn: ({id}:reIssueAccessTokenProps) => Services.reIssueAccessToken({id}),
      onError:(error) => {
        HandleAxiosErrors({api,error})
      },
      onSuccess:async(reponse) => {
        
      }
    })
  }
}
