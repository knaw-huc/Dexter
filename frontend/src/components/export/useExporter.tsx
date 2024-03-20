import { Exportable } from './Exportable';
import { useImmer } from 'use-immer';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { MainMapper } from './MainMapper';
import { toCsv } from './toCsv';

const mapper = new MainMapper();
export function useExporter(params: { handleError: (error: Error) => void }): {
  runExport: (toExport: Exportable) => void;
  isExporting: boolean;
} {
  const [isExporting, setExporting] = useImmer(false);

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
