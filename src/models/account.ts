import { ShopPDataSource } from "../data";
import { Account } from "../entities/account";

export default class AccountModel {
    private static readonly ALIAS_NAME = 'account';

    static async insert(username: string, password: string) {
        const result = await ShopPDataSource.createQueryBuilder(Account, this.ALIAS_NAME)
            .insert()
            .values([{
                username: username,
                password: password
            }])
            .execute()
            .catch(err => { throw new Error(err.message) });
        return result ? result : false;
    }

    static async find() {
        const accounts = await ShopPDataSource.createQueryBuilder(Account, this.ALIAS_NAME)
            .select()
            .getMany()
            .catch(err => { throw new Error(err.message) });
        return accounts && accounts.length > 0 ? accounts : false;
    }
}