import React, { FunctionComponent } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import { ElasticsearchProvider, useQuery } from './ElasticsearchQueryContext';
import { ElasticsearchQuery } from '../../types';
import { ElasticDatasource } from '../../datasource';
import { getDefaultTimeRange } from '@grafana/data';

const query: ElasticsearchQuery = {
  refId: 'A',
  query: '',
  metrics: [{ id: '1', type: 'count' }],
  bucketAggs: [{ type: 'date_histogram', id: '2' }],
};

describe('ElasticsearchQueryContext', () => {
  it('Should call onChange and onRunQuery with the default query when the query is empty', () => {
    const datasource = { timeField: 'TIMEFIELD' } as ElasticDatasource;
    const onChange = jest.fn();
    const onRunQuery = jest.fn();

    render(
      <ElasticsearchProvider
        query={{ refId: 'A' }}
        onChange={onChange}
        datasource={datasource}
        onRunQuery={onRunQuery}
        range={getDefaultTimeRange()}
      />
    );

    const changedQuery: ElasticsearchQuery = onChange.mock.calls[0][0];
    expect(changedQuery.query).toBeDefined();
    expect(changedQuery.alias).toBeDefined();
    expect(changedQuery.metrics).toBeDefined();
    expect(changedQuery.bucketAggs).toBeDefined();

    // Should also set timeField to the configured `timeField` option in datasource configuration
    expect(changedQuery.timeField).toBe(datasource.timeField);

    expect(onRunQuery).toHaveBeenCalled();
  });

  // the following applies to all hooks in ElasticsearchQueryContext as they all share the same code.
  describe('useQuery Hook', () => {
    it('Should throw when used outside of ElasticsearchQueryContext', () => {
      const { result } = renderHook(() => useQuery());

      expect(result.error).toBeTruthy();
    });

    it('Should return the current query object', () => {
      const wrapper: FunctionComponent = ({ children }) => (
        <ElasticsearchProvider
          datasource={{} as ElasticDatasource}
          query={query}
          onChange={() => {}}
          onRunQuery={() => {}}
          range={getDefaultTimeRange()}
        >
          {children}
        </ElasticsearchProvider>
      );

      const { result } = renderHook(() => useQuery(), {
        wrapper,
      });

      expect(result.current).toBe(query);
    });
  });
});
