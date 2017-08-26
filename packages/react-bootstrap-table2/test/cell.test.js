import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import Cell from '../src/cell';

describe('Cell', () => {
  let wrapper;
  const row = {
    id: 1,
    name: 'A'
  };

  describe('simplest cell', () => {
    const column = {
      dataField: 'id',
      text: 'ID'
    };

    beforeEach(() => {
      wrapper = shallow(<Cell row={ row } columnIndex={ 1 } rowIndex={ 1 } column={ column } />);
    });

    it('should render successfully', () => {
      expect(wrapper.length).toBe(1);
      expect(wrapper.text()).toEqual(row[column.dataField].toString());
    });
  });

  describe('when column.formatter prop is defined', () => {
    const rowIndex = 1;
    const column = {
      dataField: 'id',
      text: 'ID',
      formatExtraData: []
    };
    const formatterResult = (<h3>{ row[column.dataField] }</h3>);
    const formatter = sinon.stub()
      .withArgs(row[column.dataField], row, rowIndex, column.formatExtraData)
      .returns(formatterResult);
    column.formatter = formatter; // defined column formatter

    beforeEach(() => {
      wrapper = shallow(
        <Cell row={ row } columnIndex={ 1 } rowIndex={ rowIndex } column={ column } />);
    });

    afterEach(() => { formatter.reset(); });

    it('should render successfully', () => {
      expect(wrapper.length).toBe(1);
      expect(wrapper.find('h3').length).toBe(1);
      expect(wrapper.text()).toEqual(row[column.dataField].toString());
    });

    it('should call custom formatter correctly', () => {
      expect(formatter.callCount).toBe(1);
      expect(formatter.calledWith(row[column.dataField],
        row, rowIndex, column.formatExtraData)).toBe(true);
    });
  });

  describe('when column.style prop is defined', () => {
    let column;
    const columnIndex = 1;

    beforeEach(() => {
      column = {
        dataField: 'id',
        text: 'ID'
      };
    });

    describe('when style is an object', () => {
      beforeEach(() => {
        column.style = { backgroundColor: 'red' };
        wrapper = shallow(
          <Cell row={ row } columnIndex={ columnIndex } rowIndex={ 1 } column={ column } />);
      });

      it('should render successfully', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('td').prop('style')).toEqual(column.style);
      });
    });

    describe('when style is a function', () => {
      const returnStyle = { backgroundColor: 'red' };
      let styleCallBack;

      beforeEach(() => {
        styleCallBack = sinon.stub()
          .withArgs(row[column.dataField], row, columnIndex)
          .returns(returnStyle);
        column.style = styleCallBack;
        wrapper = shallow(
          <Cell row={ row } columnIndex={ columnIndex } rowIndex={ 1 } column={ column } />);
      });

      afterEach(() => { styleCallBack.reset(); });

      it('should render successfully', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('td').prop('style')).toEqual(returnStyle);
      });

      it('should call custom style function correctly', () => {
        expect(styleCallBack.callCount).toBe(1);
        expect(styleCallBack.calledWith(row[column.dataField], row, columnIndex)).toBe(true);
      });
    });
  });

  describe('when column.classes prop is defined', () => {
    let column;
    const columnIndex = 1;

    beforeEach(() => {
      column = {
        dataField: 'id',
        text: 'ID'
      };
    });

    describe('when classes is an object', () => {
      beforeEach(() => {
        column.classes = 'td-test-class';
        wrapper = shallow(
          <Cell row={ row } columnIndex={ columnIndex } rowIndex={ 1 } column={ column } />);
      });

      it('should render successfully', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.hasClass(column.classes)).toBe(true);
      });
    });

    describe('when classes is a function', () => {
      const returnClasses = 'td-test-class';
      let classesCallBack;

      beforeEach(() => {
        classesCallBack = sinon.stub()
          .withArgs(row[column.dataField], row, columnIndex)
          .returns(returnClasses);
        column.classes = classesCallBack;
        wrapper = shallow(
          <Cell row={ row } columnIndex={ columnIndex } rowIndex={ 1 } column={ column } />);
      });

      afterEach(() => { classesCallBack.reset(); });

      it('should render successfully', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.hasClass(returnClasses)).toBe(true);
      });

      it('should call custom classes function correctly', () => {
        expect(classesCallBack.callCount).toBe(1);
        expect(classesCallBack.calledWith(row[column.dataField], row, columnIndex)).toBe(true);
      });
    });
  });

  describe('when column.title prop is defined', () => {
    let column;
    const columnIndex = 1;

    beforeEach(() => {
      column = {
        dataField: 'id',
        text: 'ID'
      };
    });

    describe('when title is boolean', () => {
      beforeEach(() => {
        column.title = true;
        wrapper = shallow(
          <Cell row={ row } columnIndex={ columnIndex } rowIndex={ 1 } column={ column } />);
      });

      it('should render title as cell value as default', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('td').prop('title')).toEqual(row[column.dataField]);
      });
    });

    describe('when title is custom function', () => {
      const customTitle = 'test_title';
      let titleCallBack;

      beforeEach(() => {
        titleCallBack = sinon.stub()
          .withArgs(row[column.dataField], row, columnIndex)
          .returns(customTitle);
        column.title = titleCallBack;
        wrapper = shallow(
          <Cell row={ row } columnIndex={ columnIndex } rowIndex={ 1 } column={ column } />);
      });

      it('should render title correctly by custom title function', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('td').prop('title')).toBe(customTitle);
      });

      it('should call custom title function correctly', () => {
        expect(titleCallBack.callCount).toBe(1);
        expect(titleCallBack.calledWith(row[column.dataField], row, columnIndex)).toBe(true);
      });
    });
  });

  describe('when column.events prop is defined', () => {
    let column;
    const columnIndex = 1;

    beforeEach(() => {
      column = {
        dataField: 'id',
        text: 'ID',
        events: {
          onClick: sinon.stub()
        }
      };

      wrapper = shallow(
        <Cell row={ row } columnIndex={ columnIndex } rowIndex={ 1 } column={ column } />);
    });

    it('should attachs DOM event successfully', () => {
      expect(wrapper.length).toBe(1);
      expect(wrapper.find('td').prop('onClick')).toBeDefined();
    });

    it('event hook should be called when triggering', () => {
      wrapper.find('td').simulate('click');
      expect(column.events.onClick.callCount).toBe(1);
    });
  });
});