import React, {useContext} from "react"
import {ServerSource} from "../../model/DexterModel"
import {Actions} from "../../state/actions"
import {sourcesContext} from "../../state/sources/sourcesContext"
import {Source} from "./Source"
import styled from "@emotion/styled"
import {getSources} from "../../utils/API"
import {errorContext} from "../../state/error/errorContext"
import {SourceForm} from "./SourceForm"
import {AddNewSourceButton} from "./AddNewSourceButton"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export function SourceIndex() {
  const { sourcesState, dispatchSources } = React.useContext(sourcesContext);
  const [showForm, setShowForm] = React.useState(false);
    const {dispatchError} = useContext(errorContext)
  const refetchSources = async () => {
    getSources().then(function (sources) {
      dispatchSources({
        type: Actions.SET_SOURCES,
        sources: sources,
      });
    }).catch(dispatchError);
  };

  const handleSelected = (selected: ServerSource | undefined) => {
    return dispatchSources({
      type: Actions.SET_SELECTEDSOURCE,
      selectedSource: selected,
    });
  };

  return (
    <>
      <FilterRow>
          <AddNewSourceButton onClick={() => setShowForm(true)}/>
      </FilterRow>
      {showForm && (
        <SourceForm
          show={showForm}
          onClose={() => setShowForm(false)}
          refetch={refetchSources}
        />
      )}
      {sourcesState.sources &&
        sourcesState.sources.map((source: ServerSource, index: number) => (
          <Source
            key={index}
            sourceId={index}
            source={source}
            onSelect={handleSelected}
          />
        ))}
    </>
  );
}
