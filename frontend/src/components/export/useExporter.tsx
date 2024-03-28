import { Exportable } from './mapper/Exportable';
import { useImmer } from 'use-immer';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { MainMapper } from './mapper/MainMapper';
import { toCsv } from './mapper/toCsv';
import { useEffect } from 'react';
import { useThrowSync } from '../common/error/useThrowSync';
import { useUserStore } from '../../state/UserStore';

export function useExporter(): {
  runExport: (toExport: Exportable) => Promise<void>;
  isExporting: boolean;
} {
  const [isExporting, setExporting] = useImmer(false);
  const [mapper, setMapper] = useImmer<MainMapper>(null);
  const throwSync = useThrowSync();
  const referenceStyle = useUserStore().getReferenceStyle();

  useEffect(() => {
    MainMapper.init(referenceStyle).then(setMapper).catch(throwSync);
  }, []);

  async function runExport(toExport: Exportable) {
    console.log('exporting', toExport);
    setExporting(true);

    const tables = mapper.map(toExport);
    const zip = new JSZip();
    tables.forEach(t => zip.file(`${t.name}.csv`, toCsv(t)));
    const content = await zip.generateAsync({ type: 'blob' });
    const filename = `dexter-export-${toExport.id}.zip`;
    FileSaver.saveAs(content, filename);
    setExporting(false);
    console.log('finished exporting', toExport);
  }

  return { isExporting, runExport };
}
