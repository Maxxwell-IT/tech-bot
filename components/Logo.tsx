import React from 'react';

// Using a Base64 encoded image to embed the logo directly into the application.
// This ensures the logo is always displayed correctly without external network requests
// and aligns with the visual identity provided in the brand book.
const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHcKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGDSURBVHgB7doxSwNBFIXh7+y8EMFCxMYuFpZ+MvwH/A+sBGuxtrCwEJtAEGzsiY19bILg7iRCLOh/c3J3L4cDucw5Z4JsBwEAAAAAAAAAAADYyEsqO4Cl3AeyC1hKCSD7gKUsoCzlBVBvAS3c/x0IAACcqVdUFjCUEkC2AUtZQFnKC6DeAlq4/zsQAAAC8C0qywAAAACwpsoSAAAAAIBVpZYEAAAAwFYqSwEAAACsKrUsAQAAANhK5buB7AIWWlIA2QUsZQFgpZpA/wW0kP199AEAgFMlWQYAAMBeYFk2AAAAALArKMsSAAAAAIBbQVkWAQAAAFgVylIAAAAAsJXKsgQAAACwlcpSAAAAAIBVpayzWq3+bbfb3e/3V/u/DofDer3u9/vvNpt1uVze7/fX+/2qVCq/rVar1Wq1Wu35+vXr9euv318vLCw8fvx4/vjx4+HDh2t/v1+/fv3667c3Nzdfv359fn7++PFje3t7e3t7e3t7e3t7W1tbW1vb2tqamplZWVlZWVnZ2toaGhpCQ0OTk5P5+fmNjY1AIAA/fPjw6dOnT58+fQIAAADgTylLAAAAAACsUsoSAAAAAIA1QpQAAAAAViilCBAAAADeC1ECAAAAWKWUIgAAAADrBCkBAACAVUopAgAAAGgFCQAAAGA1lCEAAACAhbQUAQAAwGoqQwEAAACsoH0FAAAAACuprAUAAACwmspqAQAAAFhV2goAAAAA2EplLQAAAACwqtZaAAAAALCVytoAAAAAsKrWWgQAAABgK5W1AAAAALCq1loEAAAAwFYqa/V6/c/29vZaLZevX7+eTqfX6/VqtZqZmfkvIgAAAAAsLlopAQAAACxdSgEAAACMrQQJAAAAYOkpBQAAAMBaqkUAAAAAhlItAgAAAGCtVSMAAACAUaomAQAAAFhtNQIAAABgVNUSAQAAANhtNQIAAABgVOUSAQAAANhtNRIBAAAAOKhUEwEAAADYbTUSAQAAAAClmgkAAAAA7LaaiQAAAAAAVGo2AQAAANAJqZEIAAADAGSg1AAAAAAAAAAAAAAD+q39J1l/yBcoc/AAAAABJRU5ErkJggg==';

export const Logo: React.FC = () => {
    return (
        <img 
            src={logoBase64} 
            alt="USYK SKLO Logo" 
            style={{ width: '96px', height: 'auto' }}
        />
    );
};
