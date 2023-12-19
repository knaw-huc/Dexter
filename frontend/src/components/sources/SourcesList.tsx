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
  const { sources, setSources } = React.useContext(sourcesContext);
  const [showForm, setShowForm] = React.useState(false);
    const {setError} = useContext(errorContext)
  const refetchSources = async () => {
    getSources().then(function (sources) {
      setSources({
        type: Actions.SET_SOURCES,
        sources: sources,
      });
    }).catch(setError);
  };

  const handleSelected = (selected: ServerSource | undefined) => {
    return setSources({
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
      {sources.sources &&
        sources.sources.map((source: ServerSource, index: number) => (
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
