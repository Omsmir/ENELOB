import { FilterQuery, QueryOptions, SchemaTypeOptions, UpdateQuery } from 'mongoose';
import UserModel, { UserDocument } from '@/models/auth.model';
import { omit } from 'lodash';
import { UserInput, userToCreate } from '@/interfaces/models.interface';

import bcrypt from 'bcryptjs';
import { filterStringsArray } from '@/utils/utils';
import { MultipleFilteringService } from '@/interfaces/global.interface';

// SOLID principles interpreted

// All the route Class is a single responsability
class UserService {
    // dependency injection: composition over inheritance
    constructor(private userModel = UserModel) {}

    public createUser = async (input: userToCreate) => {
        const user = await this.userModel.create(input);

        return omit(user.toJSON(), 'password');
    };

    public updateUser = async (
        query: FilterQuery<UserDocument>,
        update: UpdateQuery<UserDocument>,
        options?: QueryOptions
    ) => {
        return await this.userModel.findOneAndUpdate(query, update, options);
    };

    public findUser = async (query: FilterQuery<UserDocument>) => {
        return await this.userModel.findOne(query)
    };
    public getAllUsers = async (query?: FilterQuery<UserDocument>, limit?: number) => {
        return await this.userModel.find(query ? query : {}).limit(limit || 10);
    };
    public deleteUser = async (query: FilterQuery<UserDocument>) => {
        return await this.userModel.findOneAndDelete(query);
    };

    public getUsersWithPagination = async (
        query: FilterQuery<UserDocument>,
        limit: string,
        cursor?: string
    ) => {
        if (cursor) {
            query._id = {
                ...(query._id || {}), // keep existing conditions like $in, $ne
                $lt: cursor, // add pagination
            };
        }
        const users = await this.userModel
            .find(query)
            .sort({ _id: -1 })
            .limit(Number(limit) + 1);

        let nextCursor: string | null = null;
        if (users.length > +limit) {
            nextCursor = users[Number(limit) - 1]._id as string; // Use the last item's _id as the nextCursor
            users.pop();
        }

        

        return { users, nextCursor };
    };

    public updateUserSpecificList = async ({
        userKey,
        friendKey,
        currUserArray,
        friendArray,
        equal,
        addition,
        friendKeyTwo,
        userKeyTwo,
        currUserSecondArray,
        friendSecondArray,
    }: MultipleFilteringService): Promise<boolean | undefined> => {
        const filteredFriendList = filterStringsArray({
            currArray: friendArray[friendKey],
            value: currUserArray._id as string,
            equal,
            addition,
        });

        const filiteredUserList = filterStringsArray({
            currArray: currUserArray[userKey],
            value: friendArray._id as string,
            equal,
            addition,
        });
        console.log(filiteredUserList)

        const userUpdated = await this.updateUser(
            { _id: currUserArray._id },
            { [userKey]: filiteredUserList, [userKeyTwo ?? ' ']: currUserSecondArray },
            { new: true, runValidators: true }
        );

        const friendUpdated = await this.updateUser(
            { _id: friendArray._id },
            { [friendKey]: filteredFriendList, [friendKeyTwo ?? ' ']: friendSecondArray },
            { new: true, runValidators: true }
        );
        if (!userUpdated || !friendUpdated) return undefined;

        return true;
    };
    public validatePassword = async ({ email, password }: { email: string; password: string }) => {
        try {
            const user = await this.findUser({ email });

            if (!user) {
                return false;
            }

            async function comparePassword(candidatePassword: string, userPassword: string) {
                try {
                    return await bcrypt.compare(candidatePassword, userPassword);
                } catch (error) {
                    console.error('Password comparison error:', error);
                    return false;
                }
            }

            const isValid = await comparePassword(password, user.password);

            if (!isValid) {
                return false;
            }

            return omit(user, 'password');
        } catch (error: any) {
            throw new Error(`validate service error ${error.message}`);
        }
    };
}

export default UserService;
