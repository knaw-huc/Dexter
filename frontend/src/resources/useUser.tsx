import { getValidated, postValidated, putValidated } from '../utils/API';
import { useBoundStore } from './store/useBoundStore';
import { useUserStore } from './store/UserStore';
import { User, UserSettings } from '../model/User';
import { useThrowSync } from '../components/common/error/useThrowSync';

export function useUser() {
  const { userResources } = useBoundStore();
  const { user, setUserName, setUserSettings } = useUserStore();
  const throwSync = useThrowSync();

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
      .catch(throwSync);
  };

  return {
    user,
    initUserResources,
    updateUserSettings,
    login,
    getReferenceStyle,
  };
}
