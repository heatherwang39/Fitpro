import api from 'axios';
import User from '../types/user';

export default async (userInfo) => {
    try {
        const _user = {
            email: userInfo.email,
            password: userInfo.password,
            username: userInfo.username,
            isTrainer: userInfo.accountType == "Trainer",
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            phone: userInfo.phone,
            goalType: userInfo.goalType,
            gender: "male"
        }
        console.log(_user)
        const res = await api.post('https://localhost:3333/users', _user)
        console.log(res)
        const user = res.data;
        return {
            status: res.status,
            data: new User(
                user._id,
                user.username,
                user.firstname,
                user.lastname,
                user.email,
                user.phone,
                user.location,
                user.height,
                user.weight,
                user.isTrainer,
                false,
                user.goalType,
                user.rating,
                user.trainers,
                user.clients,
                user.gender,
                user.price,
                user.imgsrc
            )
        }
    } catch (e) {
    }
}
