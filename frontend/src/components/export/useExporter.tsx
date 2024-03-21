import { Exportable } from './mapper/Exportable';
import { useImmer } from 'use-immer';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { MainMapper } from './mapper/MainMapper';
import { toCsv } from './mapper/toCsv';
import { useEffect } from 'react';
import { useThrowSync } from '../common/error/useThrowSync';

export function useExporter(params: { handleError: (error: Error) => void }): {
  runExport: (toExport: Exportable) => void;
  isExporting: boolean;
} {
  const [isExporting, setExporting] = useImmer(false);
  const [mapper, setMapper] = useImmer<MainMapper>(null);
  const throwSync = useThrowSync();

  useEffect(() => {
    MainMapper.init().then(setMapper).catch(throwSync);
  }, []);

  async function runExport(toExport: Exportable) {
    try {
      console.log('exporting', toExport);
      setExporting(true);

      const result = mapper.map(toExport);
      const zip = new JSZip();
      result.tables.forEach(t => zip.file(`${t.name}.zip`, toCsv(t)));
      zip.file('corpora.csv', 'id,title,description');
      const content = await zip.generateAsync({ type: 'blob' });
      const filename = `dexter-export-${toExport.id}.zip`;
      // TODO: Uncaught ReferenceError: Buffer is not defined
      FileSaver.saveAs(content, filename);
      setExporting(false);
      console.log('finished exporting', toExport);
    } catch (e) {
      params.handleError(e);
    }
  }
  return { isExporting, runExport };
}
