import React from 'react';
import * as Cite from 'citation-js';
import { H2Styled } from '../common/H2Styled';

type CitationExample = { format: string; content: string };
type CitationExampleParsed = CitationExample & { formatted: string };

export function CitationField() {
  const test = citations.map(format);
  return (
    <>
      <h1>Citation Field</h1>
      <ul>
        {test.map((t, i) => (
          <li key={i}>
            <H2Styled>{t.format}</H2Styled>
            <ul>
              <li>
                <h3>input</h3>
                <pre>{t.content}</pre>
              </li>
              <li>
                <h3>output</h3>
                <p dangerouslySetInnerHTML={{ __html: t.formatted }}></p>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

function format(citation: CitationExample): CitationExampleParsed {
  const cite = new Cite(citation.content);
  const formatted = cite.format('bibliography', {
    format: 'html',
    template: 'citation-apa',
    lang: 'en-US',
  });
  return { ...citation, formatted };
}

const citations: CitationExample[] = [
  { format: 'Wikidata QID', content: 'Q21972834' },
  { format: 'DOI', content: 'https://doi.org/10.1016/0169-5347(96)10039-2' },
  {
    format: 'bibtex',
    content: `@article{https://doi.org/10.1111/acel.12050,
author = {Boonekamp, Jelle J. and Simons, Mirre J. P. and Hemerik, Lia and Verhulst, Simon},
title = {Telomere length behaves as biomarker of somatic redundancy rather than biological age},
journal = {Aging Cell},
volume = {12},
number = {2},
pages = {330-332},
keywords = {blood pressure, body mass index, cholesterol, Gompertz, mechanisms of aging, senescence, Weibull},
doi = {https://doi.org/10.1111/acel.12050},
url = {https://onlinelibrary.wiley.com/doi/abs/10.1111/acel.12050},
eprint = {https://onlinelibrary.wiley.com/doi/pdf/10.1111/acel.12050},
abstract = {Summary Biomarkers of aging are essential to predict mortality and aging-related diseases. Paradoxically, age itself imposes a limitation on the use of known biomarkers of aging because their associations with mortality generally diminish with age. How this pattern arises is, however, not understood. With meta-analysis we show that human leucocyte telomere length (TL) predicts mortality, and that this mortality association diminishes with age, as found for other biomarkers of aging. Subsequently, we demonstrate with simulation models that this observation cannot be reconciled with the popular hypothesis that TL is proportional to biological age. Using the reliability theory of aging, we instead propose that TL is a biomarker of somatic redundancy, the body's capacity to absorb damage, which fits the observed pattern well. We discuss to what extent diminishing redundancy with age may also explain the observed diminishing mortality modulation with age of other biomarkers of aging. Considering diminishing somatic redundancy as the causal agent of aging may critically advance our understanding of the aging process, and improve predictions of life expectancy and vulnerability to aging-related diseases.},
year = {2013}
}`,
  },
];
