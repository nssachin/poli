
import React from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

import ReactTable from 'react-table';
import 'react-table/react-table.css';


import axios from 'axios';

import * as webApi from '../api/WebApi';

const CHART_TYPES = ['table', 'pie'];

class WidgetEditPanel extends React.Component {

   constructor(props) {
    super(props);
    this.state = {
      jdbcDataSources: [],
      widgetId: null,
      name: '',
      dashboardId: null,
      sqlQuery: '',
      jdbcDataSourceId: null,
      queryResult: []
    };
  }

  componentDidMount() {
    console.log('WidgetEditPanel', 'componentDidMount');
  }

  fetchWidget = async (id) => {
    const jdbcDataSources = await webApi.fetchDataSources();
    this.setState({ 
      jdbcDataSources: jdbcDataSources 
    });

    if (id === null) {
      
    } else {

    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  save = (event) => {
    event.preventDefault();
    const widget ={
      id: this.state.widgetId,
      name: this.state.name,
      dashboardId: this.state.dashboardId,
      jdbcDataSourceId: this.state.jdbcDataSourceId,
      sqlQuery: this.state.sqlQuery
    };
    console.log('save', widget);
  }

  close = () => {
    this.props.onClose();
  }

  runQuery = (event) => {
    event.preventDefault();
    const queryRequest ={
      id: this.state.jdbcDataSourceId,
      query: this.state.sqlQuery
    };

    axios.post('/ws/jdbcquery/query', queryRequest)
      .then(res => {
        const result = res.data;
        const queryResult = result;
        this.setState({
          queryResult: queryResult
        });
      });
  }

  handleAceEditorChange = (newValue) => {
    this.setState({
      sqlQuery: newValue
    });
  }

  handleDataSourceChange = (event) => {
    this.setState({ 
      jdbcDataSourceId: event.target.value
    });
  }

  render() {
    const panelClass = this.props.show ? 'right-drawer display-block' : 'right-drawer display-none';

    const dataSourceOptions = this.state.jdbcDataSources.map(ds =>
      <option value={ds.id} key={ds.id}>{ds.name}</option>
    );

    const chartOptionList = CHART_TYPES.map(o =>
      <option value={o} key={o}>{o}</option>
    );


    const headers = [];
    const queryResult = this.state.queryResult;
    if (queryResult !== undefined && queryResult.length !== 0) {
      const obj = queryResult[0];
      const keys = Object.keys(obj);
      for (const key of keys) {
        headers.push({
          Header: key,
          accessor: key
        })
      }
    }

    return (
      <div className={panelClass}>
        <h3>WidgetEditPanel</h3>
        <button onClick={() => this.props.onClose()}>Close</button>
        <button onClick={this.save}>Save</button>
        <button onClick={this.runQuery}>Run Query</button>

        <form>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={this.state.name}
            onChange={this.handleInputChange} 
          />

          <label>DataSource</label>
          <select value={this.state.jdbcDataSourceId} onChange={this.handleDataSourceChange}>
            {dataSourceOptions}
          </select>
        
          <label>SQL Query</label>
          <AceEditor
            style={{ marginTop: '8px' }}
            value={this.state.sqlQuery}
            mode="mysql"
            theme="xcode"
            name="blah2"
            onChange={this.handleAceEditorChange}
            height={'300px'}
            width={'100%'}
            fontSize={15}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />

          <label>Result</label>
          <ReactTable
            data={this.state.queryResult}
            columns={headers}
            defaultPageSize={10}
          />

          <label>Columns Mapping</label>
          <div>column name, display name, data type</div>

          <label>Chart Options</label>
          <select value={this.state.optionValue} onChange={this.handleOptionChange}>
            {chartOptionList}
          </select>

          <label><i class="fas fa-table"></i> Table</label>
          <div></div>

          <label><i class="fas fa-chart-pie"></i> Pie Chart</label>
          <div>Count "users" by "last name"</div>


        </form>
        
      </div>
    )
  };
}

export default WidgetEditPanel;