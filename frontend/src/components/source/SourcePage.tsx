import React from 'react';
import { useParams } from 'react-router-dom';
import { ResultLanguage, Source } from '../../model/DexterModel';
import { deleteLanguageFromSourceWithWarning } from '../../utils/deleteLanguageFromSourceWithWarning';
import { getSourceWithResourcesById } from '../../utils/API';
import { Languages } from '../language/Languages';
import { SourceForm } from './SourceForm';
import { EditButton } from '../common/EditButton';
import { TagList } from '../tag/TagList';
import _ from 'lodash';
import { FieldLabel, ShortFieldsSummary } from '../common/ShortFieldsSummary';
import { SourceIcon } from './SourceIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourcesBreadCrumbLink } from './SourcesBreadCrumbLink';
import { blue, grey } from '@mui/material/colors';
import isUrl from '../../utils/isUrl';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import styled from '@emotion/styled';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';

const OpenInNewOutlinedIconStyled = styled(OpenInNewOutlinedIcon)`
  margin-left: 0.4em;
`;
const A = styled.a`
  color: ${blue[600]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
export const SourcePage = () => {
  const params = useParams();
  const sourceId = params.sourceId;

  const [source, setSource] = React.useState<Source>(null);
  const [showForm, setShowForm] = React.useState(false);

  const handleSaveForm = (update: Source) => {
    setSource(update);
    setShowForm(false);
  };

  const initSource = async () => {
    setSource(await getSourceWithResourcesById(sourceId));
  };

  React.useEffect(() => {
    if (sourceId) {
      initSource();
    }
  }, [sourceId]);

  const handleDeleteLanguage = async (language: ResultLanguage) => {
    await deleteLanguageFromSourceWithWarning(language, params.sourceId);
    setSource(source => ({
      ...source,
      languages: source.languages.filter(l => l.id !== language.id),
    }));
  };

  const shortSourceFields: (keyof Source)[] = [
    'location',
    'earliest',
    'latest',
    'rights',
    'access',
    'creator',
  ];

  return (
    <div>
      <HeaderBreadCrumb>
        <SourcesBreadCrumbLink />
      </HeaderBreadCrumb>

      {source && (
        <>
          <EditButton
            onEdit={() => {
              setShowForm(true);
            }}
          />
          <h1>
            <SourceIcon verticalAlign="middle" fontSize="large" />
            {source.title}
          </h1>
          <p>{source.description}</p>
          {!_.isEmpty(source.keywords) && (
            <>
              <FieldLabel label="Keywords" />
              <TagList keywords={source.keywords} />
            </>
          )}
          <ShortFieldsSummary<Source>
            resource={source}
            fieldNames={shortSourceFields}
          />
          {source.externalRef && (
            <p style={{ marginTop: '-0.9em' }}>
              <span style={{ color: grey[600] }}>External reference: </span>
              {isUrl(source.externalRef) ? (
                <>
                  <A href={source.externalRef} target="_blank" rel="noreferrer">
                    {source.externalRef}
                  </A>
                  <OpenInNewOutlinedIconStyled fontSize="inherit" />
                </>
              ) : (
                <>{source.externalRef}</>
              )}
            </p>
          )}
          {source.notes && (
            <>
              <h2>Notes</h2>
              <p>{source.notes}</p>
            </>
          )}

          {!_.isEmpty(source.metadataValues) && (
            <MetadataValuePageFields values={source.metadataValues} />
          )}

          {!_.isEmpty(source.languages) && (
            <div>
              <h4>Languages</h4>
              <Languages
                languages={source.languages}
                onDelete={handleDeleteLanguage}
              />
            </div>
          )}
        </>
      )}
      {showForm && (
        <SourceForm
          sourceToEdit={source}
          onSave={handleSaveForm}
          onClose={() => {
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};
