import { UserDocument } from "@/models/auth.model";

export type currArrayType = {
    currArray: string[];
    value:  string;
    equal: boolean;
    addition: boolean;
};

export const filterStringsArray = ({ currArray, value, equal, addition }: currArrayType) => {
    let filteredArray: string[] = [];

    if (!currArray) return;
    if (equal && !addition) {
        const filteredValues = currArray.filter((element) => element === (value).toString());
        filteredArray.push(...filteredValues);
    } else if (equal && addition) {
        const filteredValues = currArray.filter((element) => element === value.toString());
        filteredArray.push(...filteredValues, value);
    } else if (!equal && !addition) {
        const filteredValues = currArray.filter((element) => element !== value.toString());
        filteredArray.push(...filteredValues);
    } else if (!equal && addition) {
        const filteredValues = currArray.filter((element) => element !== value.toString());
        filteredArray.push(...filteredValues, value);
    }
    return filteredArray;
};

export const grouping = (users:UserDocument[],id:string) => {
    const group: {
        userId: string | null;
        sendRequestId: string | null;
        user: UserDocument;
    }[] = [];
    let current = null;
    for (const user of users) {
        if (user.friendRequests.includes(id)) {
            current = { userId: null, sendRequestId: id, user };
            group.push(current);
        } else if (user.friends.includes(id)) {
            current = { userId: id, sendRequestId: null, user };
            group.push(current);
        } else {
            current = { userId: null, sendRequestId: null, user };
            group.push(current);
        }
    }
    return group;
};
