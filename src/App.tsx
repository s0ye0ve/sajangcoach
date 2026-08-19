import { useDiagnosisFlow } from './state/useDiagnosisFlow';
import { S1Intro } from './screens/S1Intro';
import { S2StoreInput } from './screens/S2StoreInput';
import { S3Diagnosing } from './screens/S3Diagnosing';
import { S4DiagnosisResult } from './screens/S4DiagnosisResult';
import { S5ExecutionSupport } from './screens/S5ExecutionSupport';
import { S6ItemComplete } from './screens/S6ItemComplete';
import { S7AllComplete } from './screens/S7AllComplete';

function App() {
  const { state, currentItem, start, submitCapture, pressCta, skipItem, confirmSupport, goNext } =
    useDiagnosisFlow();

  switch (state.screen) {
    case 'S1':
      return <S1Intro onStart={start} />;
    case 'S2':
      return <S2StoreInput onSubmit={submitCapture} error={state.error} />;
    case 'S3':
      return <S3Diagnosing storeName={state.store?.name ?? '가게'} />;
    case 'S4':
      return currentItem ? (
        <S4DiagnosisResult
          item={currentItem}
          index={state.currentIndex}
          total={state.queue.length}
          onCta={pressCta}
          onSkip={skipItem}
        />
      ) : null;
    case 'S5':
      return currentItem ? (
        <S5ExecutionSupport item={currentItem} onConfirm={confirmSupport} />
      ) : null;
    case 'S6':
      return currentItem ? <S6ItemComplete item={currentItem} onNext={goNext} /> : null;
    case 'S7':
      return <S7AllComplete queue={state.queue} />;
    default:
      return null;
  }
}

export default App;
