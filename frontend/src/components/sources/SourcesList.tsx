import React, {useContext} from "react"
import {ServerSource} from "../../model/DexterModel"
import {Actions} from "../../state/actions"
import {sourcesContext} from "../../state/sources/sourcesContext"
import {SourceItem} from "./SourceItem"
import styled from "@emotion/styled"
import Button from "@mui/material/Button"
import {getSources} from "../../utils/API"
import {errorContext} from "../../state/error/errorContext"
import {SourceForm} from "./SourceForm"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export function SourcesList() {
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

  const formShowHandler = () => {
    setShowForm(true);
  };

  const formCloseHandler = () => {
    setShowForm(false);
  };

  return (
    <>
      <FilterRow>
        <Button
          variant="contained"
          style={{ marginLeft: "10px" }}
          onClick={formShowHandler}
        >
          Add new source
        </Button>
      </FilterRow>
      {showForm && (
        <SourceForm
          show={showForm}
          onClose={formCloseHandler}
          refetch={refetchSources}
        />
      )}
      {sourcesState.sources &&
        sourcesState.sources.map((source: ServerSource, index: number) => (
          <SourceItem
            key={index}
            sourceId={index}
            source={source}
            onSelect={handleSelected}
          />
        ))}
    </>
  );
}
