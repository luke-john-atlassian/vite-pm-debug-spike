import { TransactionEvent } from "../../../../prosemirror-plugin/comms/send-to-backend";
import {
  ContentArea,
  Details,
  DetailsContent,
  Summary,
} from "../../../Components/Layout";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionListPair,
  DescriptionTerm,
} from "../../../Components/DescriptionList";

export function TransactionDetails({
  transactionEvent,
}: {
  transactionEvent: TransactionEvent;
}) {
  return (
    <>
      <Details>
        <Summary isTop={true}>Meta</Summary>
        <DetailsContent>
          <ContentArea>
            <DescriptionList>
              <DescriptionListPair>
                <DescriptionTerm>Duration</DescriptionTerm>
                <DescriptionDetails>
                  {transactionEvent.duration.toFixed(1)}ms
                </DescriptionDetails>
              </DescriptionListPair>
              <DescriptionListPair>
                <DescriptionTerm>Time stamp</DescriptionTerm>
                <DescriptionDetails>{transactionEvent.time}</DescriptionDetails>
              </DescriptionListPair>
            </DescriptionList>
          </ContentArea>
        </DetailsContent>
      </Details>
      <Details>
        <Summary isBottom={true}>Source</Summary>
        <DetailsContent>
          <ContentArea>
            <PrettyStack stack={transactionEvent.stack.source} />
          </ContentArea>
        </DetailsContent>
      </Details>
    </>
  );
}

function PrettyStack({ stack }: { stack: string }) {
  const [errorLine, ...pathLines] = stack.split("\n");

  return (
    <>
      {pathLines.map((pathLine) => {
        const decoratedLine = splitAndDecorateByRegex(pathLine, {
          decorate: ({ match, index }) => {
            const url = new URL(match);
            return <a href={match}>{url.pathname}</a>;
          },
        });
        return <div>{decoratedLine}</div>;
      })}
    </>
  );
}

// file:///
// http(s?)://
const urlRegex = /(((file|ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g;
function splitAndDecorateByRegex<DecoratorOutput>(
  originalText: string,
  {
    decorate,
    regex = urlRegex,
  }: {
    regex?: RegExp;
    decorate: (options: { match: string; index?: number }) => DecoratorOutput;
  }
) {
  const matches = [...originalText.matchAll(regex)];

  if (matches.length === 0) {
    return originalText;
  }

  let children = [];
  let mappedTo = 0;

  for (const match of matches) {
    if (mappedTo !== match.index) {
      // There were unmatched characters prior to this match which haven't been
      // mapped to the children.
      // Add them as plain text.
      children.push(originalText.substring(mappedTo, match.index));
    }

    children.push(decorate({ match: match[0], index: match.index }));

    // While index is guaranteed to be present, it needs to be asserted due
    // to a limitation of typescripts regex handling
    //
    // https://github.com/microsoft/TypeScript/issues/36788
    mappedTo = match.index! + match[0].length;
  }

  if (mappedTo !== originalText.length) {
    // There is text following the final match, which needs to be mapped
    // to the children.
    // Added as plain text.
    children.push(originalText.substring(mappedTo, originalText.length));
  }

  // return the mapped children with decorations
  return children;
}
