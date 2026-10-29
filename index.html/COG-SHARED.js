(() => {
  const assistiveWidget = document.createElement('div');
  assistiveWidget.className = 'site-assistive-widget';
  const assistiveLauncher = document.createElement('button');
  assistiveLauncher.type = 'button';
  assistiveLauncher.className = 'site-assistive-launcher';
  assistiveLauncher.setAttribute('aria-controls', 'siteAssistivePanel');
  assistiveLauncher.setAttribute('aria-expanded', 'false');
  assistiveLauncher.setAttribute('aria-label', 'Open Assistive tools');
  assistiveLauncher.innerHTML = '<span aria-hidden="true">✦</span><span>Assistive</span>';

  const assistivePanel = document.createElement('section');
  assistivePanel.className = 'site-assistive-panel hidden';
  assistivePanel.id = 'siteAssistivePanel';
  assistivePanel.setAttribute('aria-label', 'Assistive tools');
  assistivePanel.innerHTML = '<h2 class="site-assistive-heading">Assistive tools</h2>';
  assistiveWidget.append(assistivePanel, assistiveLauncher);
  document.body.append(assistiveWidget);

  function setMenuOpen(isOpen) {
    assistivePanel.classList.toggle('hidden', !isOpen);
    assistiveLauncher.setAttribute('aria-expanded', String(isOpen));
    assistiveLauncher.setAttribute('aria-label', isOpen ? 'Close Assistive tools' : 'Open Assistive tools');
  }

  const bibleAiWidget = document.querySelector('.bible-ai-widget');
  const bibleAiLauncher = document.getElementById('bibleAiLauncher');
  const bibleAiPanel = document.getElementById('bibleAiPanel');
  const bibleAiClose = document.getElementById('bibleAiClose');
  if (bibleAiWidget && bibleAiLauncher && bibleAiPanel) {
    bibleAiPanel.classList.add('site-assistive-popover');
    assistiveWidget.append(bibleAiPanel);
    assistivePanel.append(bibleAiLauncher);
    bibleAiWidget.remove();

    bibleAiLauncher.addEventListener('click', () => setMenuOpen(false));
    bibleAiClose?.addEventListener('click', () => {
      setMenuOpen(true);
      assistiveLauncher.focus();
    });

    document.querySelectorAll('[data-open-bible-ai]').forEach(button => {
      button.addEventListener('click', () => setMenuOpen(false));
    });
  }

  const notesStorageKey = 'cog-san-juan-bible-notes';
  const notesButton = document.createElement('button');
  notesButton.type = 'button';
  notesButton.className = 'bible-notepad-launcher';
  notesButton.setAttribute('aria-controls', 'bibleNotepadPanel');
  notesButton.setAttribute('aria-expanded', 'false');
  notesButton.innerHTML = '<span aria-hidden="true">▤</span><span>Notepad</span>';

  const notesPanel = document.createElement('section');
  notesPanel.className = 'bible-notepad-panel site-assistive-popover hidden';
  notesPanel.id = 'bibleNotepadPanel';
  notesPanel.setAttribute('aria-label', 'Personal notepad');

  const notesHeader = document.createElement('div');
  notesHeader.className = 'bible-notepad-header';
  const notesTitle = document.createElement('h2');
  notesTitle.textContent = 'My Notepad';
  const closeNotesButton = document.createElement('button');
  closeNotesButton.type = 'button';
  closeNotesButton.className = 'bible-notepad-close';
  closeNotesButton.setAttribute('aria-label', 'Close notepad');
  closeNotesButton.textContent = '×';
  notesHeader.append(notesTitle, closeNotesButton);

  const notesDescription = document.createElement('label');
  notesDescription.className = 'bible-notepad-label';
  notesDescription.htmlFor = 'bibleNotepadText';
  notesDescription.textContent = 'Write and save your notes on this device.';

  const notesTextarea = document.createElement('textarea');
  notesTextarea.id = 'bibleNotepadText';
  notesTextarea.className = 'bible-notepad-text';
  notesTextarea.maxLength = 20000;
  notesTextarea.placeholder = 'Type your notes here...';
  notesTextarea.setAttribute('aria-label', 'Notepad text');

  const notesFooter = document.createElement('div');
  notesFooter.className = 'bible-notepad-footer';
  const notesStatus = document.createElement('span');
  notesStatus.className = 'bible-notepad-status';
  notesStatus.setAttribute('aria-live', 'polite');
  notesStatus.textContent = 'Saved on this device';
  const clearNotesButton = document.createElement('button');
  clearNotesButton.type = 'button';
  clearNotesButton.className = 'bible-notepad-clear';
  clearNotesButton.textContent = 'Clear notes';
  notesFooter.append(notesStatus, clearNotesButton);
  notesPanel.append(notesHeader, notesDescription, notesTextarea, notesFooter);
  assistivePanel.append(notesButton);
  assistiveWidget.append(notesPanel);

  try {
    notesTextarea.value = localStorage.getItem(notesStorageKey) || '';
  } catch (error) {
    notesStatus.textContent = 'Notes cannot be loaded in this browser.';
    notesStatus.classList.add('is-error');
    console.warn('Unable to load saved notepad content.', error);
  }

  function closeNotepad(returnFocus = true) {
    notesPanel.classList.add('hidden');
    notesButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) {
      setMenuOpen(true);
      assistiveLauncher.focus();
    }
  }

  notesButton.addEventListener('click', () => {
    const shouldOpen = notesPanel.classList.contains('hidden');
    if (shouldOpen) {
      bibleAiPanel?.classList.add('hidden');
      bibleAiLauncher?.setAttribute('aria-expanded', 'false');
      notesPanel.classList.remove('hidden');
      notesButton.setAttribute('aria-expanded', 'true');
      setMenuOpen(false);
      notesTextarea.focus();
    } else {
      closeNotepad();
    }
  });

  closeNotesButton.addEventListener('click', () => closeNotepad());

  notesTextarea.addEventListener('input', () => {
    try {
      localStorage.setItem(notesStorageKey, notesTextarea.value);
      notesStatus.textContent = 'Saved on this device';
      notesStatus.classList.remove('is-error');
    } catch (error) {
      notesStatus.textContent = 'Unable to save notes in this browser.';
      notesStatus.classList.add('is-error');
      console.warn('Unable to save notepad content.', error);
    }
  });

  clearNotesButton.addEventListener('click', () => {
    if (!notesTextarea.value || !window.confirm('Clear all saved notes?')) return;
    notesTextarea.value = '';
    notesTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    notesTextarea.focus();
  });

  const clock = document.querySelector('.floating-clock');
  if (clock) assistivePanel.append(clock);

  const storageKey = 'cog-san-juan-view-zoom';
  const zoomLevels = [80, 90, 100, 110, 120, 130, 140, 150];
  const zoomControls = document.createElement('div');
  zoomControls.className = 'site-zoom-controls';
  zoomControls.setAttribute('role', 'group');
  zoomControls.setAttribute('aria-label', 'Page zoom controls');
  zoomControls.innerHTML = `
    <button type="button" data-zoom-change="-1" aria-label="Zoom out" title="Zoom out">−</button>
    <button type="button" data-zoom-reset aria-label="Reset zoom" title="Reset zoom">100%</button>
    <button type="button" data-zoom-change="1" aria-label="Zoom in" title="Zoom in">+</button>
  `;
  assistivePanel.append(zoomControls);

  const zoomLabel = zoomControls.querySelector('[data-zoom-reset]');
  let zoom = 100;

  try {
    const savedZoom = Number(localStorage.getItem(storageKey));
    if (zoomLevels.includes(savedZoom)) zoom = savedZoom;
  } catch (error) {
    console.warn('Unable to load saved page zoom preference.', error);
  }

  function applyZoom(save = true) {
    document.documentElement.style.fontSize = `${zoom}%`;
    zoomLabel.textContent = `${zoom}%`;
    zoomControls.querySelector('[data-zoom-change="-1"]').disabled = zoom === zoomLevels[0];
    zoomControls.querySelector('[data-zoom-change="1"]').disabled = zoom === zoomLevels[zoomLevels.length - 1];

    if (save) {
      try {
        localStorage.setItem(storageKey, String(zoom));
      } catch (error) {
        console.warn('Unable to save page zoom preference.', error);
      }
    }
  }

  zoomControls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.hasAttribute('data-zoom-reset')) {
      zoom = 100;
    } else {
      const direction = Number(button.dataset.zoomChange);
      const currentIndex = zoomLevels.indexOf(zoom);
      zoom = zoomLevels[Math.max(0, Math.min(zoomLevels.length - 1, currentIndex + direction))];
    }
    applyZoom();
  });

  const meetLink = document.createElement('a');
  meetLink.className = 'site-assistive-action';
  meetLink.href = 'https://meet.google.com/';
  meetLink.target = '_blank';
  meetLink.rel = 'noopener noreferrer';
  meetLink.textContent = 'Open Google Meet';
  meetLink.addEventListener('click', () => setMenuOpen(false));

  const projectButton = document.createElement('button');
  projectButton.type = 'button';
  projectButton.className = 'site-assistive-action';
  projectButton.textContent = 'Project a file';

  const projectInput = document.createElement('input');
  projectInput.className = 'site-project-input';
  projectInput.type = 'file';
  projectInput.accept = '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm';
  projectInput.setAttribute('aria-label', 'Choose a file to present');

  const projectPanel = document.createElement('section');
  projectPanel.className = 'site-project-panel site-assistive-popover hidden';
  projectPanel.setAttribute('aria-label', 'Project a file');
  const projectHeader = document.createElement('div');
  projectHeader.className = 'site-assistive-subpanel-header';
  const projectHeading = document.createElement('h2');
  projectHeading.textContent = 'Project a file';
  const projectClose = document.createElement('button');
  projectClose.type = 'button';
  projectClose.className = 'bible-notepad-close';
  projectClose.setAttribute('aria-label', 'Close project panel');
  projectClose.textContent = '×';
  projectHeader.append(projectHeading, projectClose);

  const projectMessage = document.createElement('p');
  projectMessage.className = 'site-assistive-description';
  projectMessage.textContent = 'Choose a file to open in a new tab. Then, in Google Meet, select Present now and share that tab or window. You must confirm sharing in Meet.';

  const projectFileName = document.createElement('p');
  projectFileName.className = 'site-project-filename';
  projectFileName.textContent = 'No file selected.';

  const chooseProjectFile = document.createElement('button');
  chooseProjectFile.type = 'button';
  chooseProjectFile.className = 'site-assistive-action';
  chooseProjectFile.textContent = 'Choose file';

  const openProjectFile = document.createElement('a');
  openProjectFile.className = 'site-assistive-action hidden';
  openProjectFile.target = '_blank';
  openProjectFile.rel = 'noopener noreferrer';
  openProjectFile.textContent = 'Open selected file in new tab';

  const projectMeetLink = document.createElement('a');
  projectMeetLink.className = 'site-assistive-action';
  projectMeetLink.href = 'https://meet.google.com/';
  projectMeetLink.target = '_blank';
  projectMeetLink.rel = 'noopener noreferrer';
  projectMeetLink.textContent = 'Open Google Meet';
  projectPanel.append(projectHeader, projectMessage, projectFileName, chooseProjectFile, openProjectFile, projectMeetLink);
  assistivePanel.append(meetLink, projectButton, projectInput);
  assistiveWidget.append(projectPanel);

  let projectFileUrl = null;
  projectButton.addEventListener('click', () => projectInput.click());
  chooseProjectFile.addEventListener('click', () => projectInput.click());
  projectInput.addEventListener('change', () => {
    const file = projectInput.files?.[0];
    if (!file) return;
    if (projectFileUrl) URL.revokeObjectURL(projectFileUrl);
    projectFileUrl = URL.createObjectURL(file);
    openProjectFile.href = projectFileUrl;
    openProjectFile.classList.remove('hidden');
    projectFileName.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
    projectPanel.classList.remove('hidden');
    feedbackPanel.classList.add('hidden');
    setMenuOpen(false);
  });
  projectClose.addEventListener('click', () => {
    projectPanel.classList.add('hidden');
    assistiveLauncher.focus();
  });
  projectMeetLink.addEventListener('click', () => projectPanel.classList.add('hidden'));
  window.addEventListener('pagehide', () => {
    if (projectFileUrl) URL.revokeObjectURL(projectFileUrl);
  }, { once: true });

  const feedbackButton = document.createElement('button');
  feedbackButton.type = 'button';
  feedbackButton.className = 'site-assistive-action';
  feedbackButton.textContent = 'Send feedback';

  const feedbackPanel = document.createElement('section');
  feedbackPanel.className = 'site-feedback-panel site-assistive-popover hidden';
  feedbackPanel.setAttribute('aria-label', 'Website feedback');
  feedbackPanel.innerHTML = `
    <div class="site-assistive-subpanel-header">
      <h2>Website feedback</h2>
      <button type="button" class="bible-notepad-close" data-feedback-close aria-label="Close feedback form">×</button>
    </div>
    <p class="site-assistive-description">Create an email draft to the church, then review and send it from your email app.</p>
    <form class="site-feedback-form">
      <label>Name <input name="name" type="text" maxlength="100" autocomplete="name" required></label>
      <label>Email (optional) <input name="email" type="email" maxlength="254" autocomplete="email"></label>
      <label>Your feedback <textarea name="message" rows="5" maxlength="2000" required></textarea></label>
      <p class="site-feedback-status" aria-live="polite"></p>
      <button class="site-assistive-action" type="submit">Continue to email</button>
      <a class="site-assistive-action hidden" data-feedback-draft>Open email draft</a>
    </form>
  `;
  assistivePanel.append(feedbackButton);
  assistiveWidget.append(feedbackPanel);

  feedbackButton.addEventListener('click', () => {
    setMenuOpen(false);
    projectPanel.classList.add('hidden');
    feedbackPanel.classList.remove('hidden');
    feedbackPanel.querySelector('input[name="name"]').focus();
  });

  feedbackPanel.querySelector('[data-feedback-close]').addEventListener('click', () => {
    feedbackPanel.classList.add('hidden');
    assistiveLauncher.focus();
  });

  feedbackPanel.querySelector('.site-feedback-form').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    if (!name || !message) return;

    const subject = encodeURIComponent('COG San Juan website feedback');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email || 'Not provided'}\n\nFeedback:\n${message}`);
    const mailto = `mailto:cogsanjuangingoog@gmail.com?subject=${subject}&body=${body}`;
    const draftLink = feedbackPanel.querySelector('[data-feedback-draft]');
    draftLink.href = mailto;
    draftLink.classList.remove('hidden');
    feedbackPanel.querySelector('.site-feedback-status').textContent = 'Your email draft is ready. Open it and send it from your email app.';
  });

  assistiveLauncher.addEventListener('click', () => {
    const shouldOpen = assistivePanel.classList.contains('hidden');
    if (shouldOpen) {
      bibleAiPanel?.classList.add('hidden');
      bibleAiLauncher?.setAttribute('aria-expanded', 'false');
      notesPanel.classList.add('hidden');
      notesButton.setAttribute('aria-expanded', 'false');
      projectPanel.classList.add('hidden');
      feedbackPanel.classList.add('hidden');
    }
    setMenuOpen(shouldOpen);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;

    if (!notesPanel.classList.contains('hidden')) {
      closeNotepad();
    } else if (bibleAiPanel && !bibleAiPanel.classList.contains('hidden')) {
      setMenuOpen(true);
      assistiveLauncher.focus();
    } else if (!projectPanel.classList.contains('hidden')) {
      projectPanel.classList.add('hidden');
      assistiveLauncher.focus();
    } else if (!feedbackPanel.classList.contains('hidden')) {
      feedbackPanel.classList.add('hidden');
      assistiveLauncher.focus();
    } else if (document.activeElement === bibleAiLauncher) {
      setMenuOpen(true);
      assistiveLauncher.focus();
    } else if (!assistivePanel.classList.contains('hidden')) {
      setMenuOpen(false);
      assistiveLauncher.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!assistivePanel.classList.contains('hidden') &&
        !assistiveWidget.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  applyZoom(false);
})();
