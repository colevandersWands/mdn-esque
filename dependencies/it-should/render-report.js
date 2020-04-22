const renderReport = (testDivId, func, report) => {


  const container = document.createElement('div');
  container.id = report.describe;

  const renderSection = (headerLevel, source, report) => {
    const subContainer = document.createElement('div');
    subContainer.id = report.describe;

    const title = document.createElement(headerLevel);
    title.innerHTML = report.describe;
    subContainer.appendChild(title);

    const summary = report.didThrow
      ? report.forced
        ? 'Forced Exit'
        : 'Error'
      : report.pass
        ? 'Pass' : 'Fail';
    const summaryEl = document.createElement('code');
    summaryEl.innerHTML = summary;
    subContainer.appendChild(summaryEl);

    const codeEl = document.createElement('code');
    codeEl.innerHTML = source;
    codeEl.className = "language-js line-numbers";
    Prism.highlightAllUnder(codeEl);
    const pre = document.createElement('pre');
    pre.appendChild(codeEl);
    pre.style.fontSize = '80%';
    subContainer.appendChild(pre);

    return subContainer;
  };

  container.appendChild(renderSection('h1', func.toString(), report));

  for (let subReport of report.log) {
    if (!subReport.describe) { continue }

    container.appendChild(renderSection('h2', subReport.source, subReport));
  };

  document.getElementById(testDivId).appendChild(container);
};

