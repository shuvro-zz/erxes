import gql from 'graphql-tag';
import { StagesQueryResponse } from 'modules/boards/types';
import { IPipeline } from 'modules/boards/types';
import Spinner from 'modules/common/components/Spinner';
import { IButtonMutateProps } from 'modules/common/types';
import { withProps } from 'modules/common/utils';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import PipelineForm from '../components/PipelineForm';
import { queries } from '../graphql';
import { IOption } from '../types';

type Props = {
  pipeline?: IPipeline;
  boardId: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  show: boolean;
  type: string;
  options?: IOption;
};

type FinalProps = {
  stagesQuery: StagesQueryResponse;
} & Props;

class PipelineFormContainer extends React.Component<FinalProps> {
  render() {
    const { stagesQuery, boardId, renderButton, options } = this.props;

    if (stagesQuery && stagesQuery.loading) {
      return <Spinner />;
    }

    const stages = stagesQuery ? stagesQuery.stages : [];

    const extendedProps = {
      ...this.props,
      stages,
      boardId,
      renderButton
    };

    const Form = options ? options.PipelineForm : PipelineForm;

    return <Form {...extendedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, StagesQueryResponse, { pipelineId: string }>(
      gql(queries.stages),
      {
        name: 'stagesQuery',
        skip: props => !props.pipeline,
        options: ({ pipeline }: { pipeline?: IPipeline }) => ({
          variables: { pipelineId: pipeline ? pipeline._id : '' },
          fetchPolicy: 'network-only'
        })
      }
    )
  )(PipelineFormContainer)
);
