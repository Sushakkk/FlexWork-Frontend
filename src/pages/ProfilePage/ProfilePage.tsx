import { Button, Form } from "reactstrap";
import { FormEvent, useEffect, useState } from "react";
import { handleUpdateProfile, setValidationError } from "../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import CustomInput from "../../components/CustomInput";

export const ProfilePage = () => {
    const { username, first_name, last_name, password="", validation_error, validation_success, checked } = useAppSelector((state) => state.user);

    // Инициализация состояния с данными из Redux
    const [inputUsername, setInputUsername] = useState(username);
    const [inputFirstName, setInputFirstName] = useState(first_name);
    const [inputLastName, setInputLastName] = useState(last_name);
    const [inputPassword, setInputPassword] = useState(password);

    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const dispatch = useAppDispatch();

    // Слежение за изменениями в Redux-данных и обновление локальных состояний
    useEffect(() => {
        // Проверяем значения при монтировании компонента и синхронизируем их
        setInputUsername(username);
        setInputFirstName(first_name);
        setInputLastName(last_name);
    }, [username, first_name, last_name]); // Эта зависимость обновит локальные состояния при изменении данных в Redux

    useEffect(() => {
        const isUsernameValid = inputUsername.length !== 0;
        const isFirstNameValid = inputFirstName.length !== 0;
        const isLastNameValid = inputLastName.length !== 0;
        const isPasswordValid = inputPassword.length !== 0; // Password is optional

        setIsUsernameValid(isUsernameValid);
        setIsFirstNameValid(isFirstNameValid);
        setIsLastNameValid(isLastNameValid);
        setIsPasswordValid(isPasswordValid);

        const isValid = isUsernameValid && isFirstNameValid && isLastNameValid;
        dispatch(setValidationError(!isValid));
    }, [inputUsername, inputFirstName, inputLastName, inputPassword, dispatch]);

    const handleSaveProfile = async (e: FormEvent) => {
        e.preventDefault();

        if (validation_error) {
            return;
        }

        const data = {
            username: inputUsername,
            first_name: inputFirstName,
            last_name: inputLastName,
            password: inputPassword,
        };

        dispatch(handleUpdateProfile(data));
    };

    // Если данные еще не загружены (checked === false), можно отобразить загрузку или пустую форму
    if (!checked) {
        return <div>Loading...</div>;
    }



    return (
        <main id="main" className="page">
            <div className="page__services _container">
                <Form onSubmit={handleSaveProfile} className="w-25">
                    <CustomInput
                        label="Логин"
                        placeholder="Введите новый логин"
                        value={inputUsername}
                        setValue={setInputUsername}
                        error={validation_error}
                        valid={isUsernameValid}
                        required={false}
                        disabled={false}
                    />
                    <CustomInput
                        label="Имя"
                        placeholder="Введите новое имя"
                        value={inputFirstName}
                        setValue={setInputFirstName}
                        error={validation_error}
                        valid={isFirstNameValid}
                        required={false}
                        disabled={false}
                    />
                    <CustomInput
                        label="Фамилия"
                        placeholder="Введите новую фамилию"
                        value={inputLastName}
                        setValue={setInputLastName}
                        error={validation_error}
                        valid={isLastNameValid}
                        required={false}
                        disabled={false}
                    />
                    <CustomInput
                        label="Пароль"
                        placeholder="Введите новый пароль"
                        value={inputPassword}
                        setValue={setInputPassword}
                        error={validation_error}
                        valid={isPasswordValid}
                        required={false}
                        disabled={false}
                    />
                    <Button type="submit" color="primary" className="mt-3">
                        Сохранить
                    </Button>
                </Form>
            </div>
        </main>
    );
};
