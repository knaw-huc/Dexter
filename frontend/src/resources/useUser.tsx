import { User, UserSettings } from '../model/DexterModel';
import { getValidated, postValidated, putValidated } from '../utils/API';
import { useBoundStore } from './store/useBoundStore';
import { useUserStore } from './store/UserStore';

export function useUser() {
  const { userResources } = useBoundStore();
  const { user, setUserName, setUserSettings } = useUserStore();

  const login = async (): Promise<User> => {
    const user = await postValidated(`/api/user/login`);
    setUserName(user.name);
    setUserSettings(user.settings);
    return user;
  };

  const updateUserSettings = async (
    userSettings: UserSettings,
  ): Promise<void> => {
    const result = await putValidated(`/api/user/settings`, userSettings);
    setUserSettings(result);
  };

  const getReferenceStyle = () => {
    return user.settings.referenceStyle;
  };

  const initUserResources = async () => {
    await getValidated(`/api/user/resources`)
      .then(r => {
        userResources.setUserResources(r);
        userResources.setLoading(false);
      })
      .catch(userResources.setError);
  };

  return {
    user,
    initUserResources,
    updateUserSettings,
    login,
    getReferenceStyle,
  };
}
