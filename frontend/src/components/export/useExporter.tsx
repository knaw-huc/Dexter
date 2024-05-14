import { Exportable } from './mapper/Exportable';
import { useImmer } from 'use-immer';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { MainMapper } from './mapper/MainMapper';
import { toCsv } from './mapper/toCsv';
import { useEffect } from 'react';
import { useThrowSync } from '../common/error/useThrowSync';
import { useMetadata } from '../../resources/useMetadata';
import { useUser } from '../../resources/useUser';

export function useExporter(): {
  runExport: (toExport: Exportable) => Promise<void>;
  isExporting: boolean;
} {
  const [isExporting, setExporting] = useImmer(false);
  const [mapper, setMapper] = useImmer<MainMapper>(null);
  const throwSync = useThrowSync();
  const referenceStyle = useUser().getReferenceStyle();
  const { getMetadataKeys } = useMetadata();
  const keys = getMetadataKeys();
  useEffect(() => {
    MainMapper.init(referenceStyle, keys).then(setMapper).catch(throwSync);
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
  }

  return { isExporting, runExport };
}
