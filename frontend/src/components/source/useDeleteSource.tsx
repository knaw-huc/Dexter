import { useNavigate } from 'react-router-dom';
import { reject } from '../../utils/reject';
import { useSources } from '../../resources/useSources';
import { Source } from '../../model/Source';

export function useDeleteSource(params: { onError: (error: Error) => void }): {
  deleteSource: (source: Source) => void;
} {
  const { deleteSource } = useSources();
  const navigate = useNavigate();

  return {
    deleteSource: async (source: Source) => {
      if (reject('Delete this source?')) {
        return;
      }

      try {
        await deleteSource(source.id);
        navigate(`/sources`);
      } catch (e) {
        params.onError(e);
      }
    },
  };
}
