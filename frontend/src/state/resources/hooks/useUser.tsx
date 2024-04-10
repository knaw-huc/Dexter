import {
  ResultUserResources,
  User,
  UserSettings,
} from '../../../model/DexterModel';
import { getValidated, postValidated, putValidated } from '../../../utils/API';
import { useBoundStore } from '../useBoundStore';
import { useUserStore } from '../../UserStore';

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

  const getUserResources = async (): Promise<ResultUserResources> => {
    const result = await getValidated(`/api/user/resources`);
    userResources.setUserResources(result);
    userResources.setLoading(false);
    return result;
  };

  return {
    user,
    getUserResources,
    updateUserSettings,
    login,
    getReferenceStyle,
  };
}
