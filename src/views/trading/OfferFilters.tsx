import React, { useState, useReducer } from 'react';
import {
  SingleLine,
  Separation,
  ResponsiveLine,
  NoWrapTitle,
} from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import Modal from '../../components/modal/ReactModal';
import { FilterModal } from './Modal/FilterModal';
import { SortOptions } from './OfferConfigs';
import { QueryProps } from '../../../pages/trading';
import { XSvg } from '../../components/generic/Icons';
import { renderLine } from '../../components/generic/Helpers';
import { chartColors } from '../../styles/Themes';
import { useRouter } from 'next/router';

type ActionType = {
  type: 'addFilter' | 'addSort' | 'removeSort' | 'removeFilter' | 'changeLimit';
  state?: QueryProps;
  newItem?: {};
  removeKey?: string;
  changeLimit?: number;
};

const reducer = (state: QueryProps, action: ActionType): QueryProps => {
  const { sort, filters } = state;
  switch (action.type) {
    case 'addSort':
      let direction = {};
      if (sort && !sort.direction) {
        direction = { direction: 'desc' };
      }
      const newSort = { ...sort, ...direction, ...action.newItem };
      return { ...state, sort: newSort };
    case 'removeSort':
      return { ...state, sort: { by: '', direction: '' } };
    case 'addFilter':
      const newFilters = { ...filters, ...action.newItem };
      return { ...state, filters: newFilters };
    case 'removeFilter':
      if (action.removeKey) {
        const remaining = { ...filters };
        delete remaining[action.removeKey];
        return { ...state, filters: remaining };
      }
      return state;
    case 'changeLimit':
      if (action.changeLimit) {
        return {
          ...state,
          pagination: { limit: action.changeLimit, offset: 0 },
        };
      }
      return state;
    default:
      throw new Error();
  }
};

interface FilterProps {
  offerFilters: QueryProps;
}

export interface FilterType {
  name: string;
  title: string;
  optionOne?: string;
  optionTwo?: string;
}

export const OfferFilters = ({ offerFilters }: FilterProps) => {
  const { push } = useRouter();

  const [filterState, dispatch] = useReducer(reducer, offerFilters);

  const [modalType, setModalType] = useState<string>('none');
  const [willApply, setWillApply] = useState<boolean>(false);

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <SingleButton selected={selected} onClick={onClick}>
      {text}
    </SingleButton>
  );

  const handleSave = () =>
    push({ search: `?filter=${btoa(JSON.stringify(filterState))}` });

  const handleRemoveAll = () => push({ search: '' });

  const handleRemove = (removeKey: string) => {
    dispatch({ type: 'removeFilter', removeKey });
  };

  const renderAppliedFilters = () => {
    const currentFilters = filterState.filters;
    const activeFilters = [];
    for (const key in currentFilters) {
      if (currentFilters.hasOwnProperty(key)) {
        const element = currentFilters[key];
        activeFilters.push(
          renderLine(key, element, `${key}-${element}`, () => handleRemove(key))
        );
      }
    }
    return <>{activeFilters.map(filter => filter)}</>;
  };

  const renderLimitOptions = () => {
    const currentLimit = filterState.pagination.limit;

    const renderButton = (value: number, margin?: string) => (
      <ColorButton
        onClick={() => dispatch({ type: 'changeLimit', changeLimit: value })}
        selected={currentLimit === value}
        withMargin={margin}
      >
        {value}
      </ColorButton>
    );

    return (
      <SingleLine>
        {renderButton(25)}
        {renderButton(50, '0 4px 0')}
        {renderButton(100)}
      </SingleLine>
    );
  };

  const renderFilters = () => {
    return (
      <>
        <Separation />
        <ResponsiveLine>
          <NoWrapTitle>Results:</NoWrapTitle>
          {renderLimitOptions()}
        </ResponsiveLine>
        <Separation />
        <ResponsiveLine>
          <NoWrapTitle>Filters</NoWrapTitle>
          <ColorButton arrow={true} onClick={() => setModalType('new')}>
            New Filter
          </ColorButton>
        </ResponsiveLine>
        {Object.keys(filterState.filters).length > 0 && renderAppliedFilters()}
        <Separation />
        <ResponsiveLine>
          <NoWrapTitle>Sort By:</NoWrapTitle>
          <ColorButton arrow={true} onClick={() => setModalType('sort')}>
            {SortOptions.find(option => option.name === filterState.sort.by)
              ?.title ?? 'None'}
          </ColorButton>
        </ResponsiveLine>
        {!!filterState.sort.by && (
          <ResponsiveLine>
            <NoWrapTitle>Sort Direction:</NoWrapTitle>
            <MultiButton>
              {renderButton(
                () => {
                  dispatch({
                    type: 'addSort',
                    newItem: { direction: 'asc' },
                  });
                },
                'Asc',
                filterState.sort.direction === 'asc'
              )}
              {renderButton(
                () => {
                  dispatch({
                    type: 'addSort',
                    newItem: { direction: 'desc' },
                  });
                },
                'Desc',
                filterState.sort.direction !== 'asc'
              )}
            </MultiButton>
          </ResponsiveLine>
        )}
        <Separation />
        <SingleLine>
          <ColorButton
            fullWidth={true}
            withMargin={'16px 4px 0 0'}
            onClick={handleSave}
          >
            Filter
          </ColorButton>
          <ColorButton
            color={chartColors.orange2}
            fullWidth={true}
            withMargin={'16px 0 0 4px'}
            onClick={handleRemoveAll}
          >
            Remove All
          </ColorButton>
        </SingleLine>
      </>
    );
  };

  return (
    <>
      <SingleLine>
        Filters
        <ColorButton
          arrow={!willApply}
          onClick={() => setWillApply(prev => !prev)}
        >
          {willApply ? <XSvg /> : 'Apply'}
        </ColorButton>
      </SingleLine>
      {willApply && renderFilters()}
      <Modal
        isOpen={modalType !== 'none'}
        closeCallback={() => setModalType('none')}
      >
        <FilterModal
          type={modalType}
          dispatch={dispatch}
          setModalType={setModalType}
        />
      </Modal>
    </>
  );
};
