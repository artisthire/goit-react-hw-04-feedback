import { useReducer } from 'react';
import { Wrapper, Container } from './App.styled';

import Section from 'components/Section';
import FeedbackOptions from 'components/FeedbackOptions';
import Statistics from 'components/Statistics';
import Notification from 'components/Notification';

function reducer(state, action) {
  switch (action.type) {
    case 'good':
      return { ...state, good: state.good + action.payload };
    case 'neutral':
      return { ...state, neutral: state.neutral + action.payload };
    case 'bad':
      return { ...state, bad: state.bad + action.payload };
    default:
      throw new Error('Unexpected type');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    good: 0,
    neutral: 0,
    bad: 0,
  });

  function handleLeaveFeedback(feedbackName) {
    return () => {
      dispatch({ type: feedbackName, payload: 1 });
    };
  }

  function countTotalFeedback() {
    return Object.values(state).reduce((summ, value) => summ + value, 0);
  }

  function countPositiveFeedbackPercentage() {
    const totalFeedback = countTotalFeedback();
    const positiveFeedbackCount = Object.entries(state).reduce(
      (summ, [feedbackName, value]) =>
        feedbackName === 'good' ? summ + value : summ,
      0
    );

    const percentage =
      positiveFeedbackCount > 0
        ? Math.round((positiveFeedbackCount / totalFeedback) * 100)
        : 0;

    return percentage + '%';
  }

  const totalFeedback = countTotalFeedback();
  const positivePercentage = countPositiveFeedbackPercentage();
  const btnNames = Object.keys(state);
  const statisticData = Object.entries(state);

  return (
    <Wrapper>
      <Container>
        <Section title="Please leave feedback">
          <FeedbackOptions
            options={btnNames}
            onLeaveFeedback={handleLeaveFeedback}
          />
        </Section>
        <Section title="Statistics">
          {totalFeedback > 0 && (
            <Statistics
              options={statisticData}
              total={totalFeedback}
              positivePercentage={positivePercentage}
            />
          )}

          {!totalFeedback && <Notification message="There is no feedback" />}
        </Section>
      </Container>
    </Wrapper>
  );
}

export default App;
