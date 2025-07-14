document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        login: document.getElementById('login-screen'),
        createAccount: document.getElementById('create-account-screen'),
        workflow: document.getElementById('workflow-screen'),
        subscription: document.getElementById('subscription-screen'),
        monthlyDocument: document.getElementById('monthly-document-screen'),
        addressChange: document.getElementById('address-change-screen'),
        confirmation: document.getElementById('confirmation-screen'),
    };

    const loginForm = document.getElementById('login-form');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const createAccountForm = document.getElementById('create-account-form');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const workflowSelect = document.getElementById('workflowSelect');
    const subscriptionForm = document.getElementById('subscription-form');
    const addCandidateBtn = document.getElementById('addCandidateBtn');
    const monthlyDocumentForm = document.getElementById('monthly-document-form');
    const addressChangeForm = document.getElementById('address-change-form');
    const searchZipCodeBtn = document.getElementById('searchZipCodeBtn');
    const confirmationContent = document.getElementById('confirmation-content');
    const backToFormBtn = document.getElementById('backToFormBtn');
    const submitFinalBtn = document.getElementById('submitFinalBtn');
    const backToWorkflowBtns = document.querySelectorAll('.back-to-workflow-btn');

    let currentFormId = ''; // 現在のフォームのIDを保持

    // --- 汎用関数 ---

    // 画面を切り替える関数
    function showScreen(screenId) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        screens[screenId].classList.add('active');
    }

    // 必須入力チェックとエラー表示
    function validateForm(form) {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            const errorElement = document.getElementById(`${input.id}-error`);
            if (!input.value.trim()) {
                if (errorElement) {
                    errorElement.textContent = 'この項目は必須です。';
                }
                input.classList.add('error');
                isValid = false;
            } else {
                if (errorElement) {
                    errorElement.textContent = '';
                }
                input.classList.remove('error');
            }
        });
        return isValid;
    }

    // 入力値のクリア
    function clearFormInputs(form) {
        form.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.type === 'file') {
                input.value = ''; // ファイル入力はvalueを直接設定できないため
            } else if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
            input.classList.remove('error');
            const errorElement = document.getElementById(`${input.id}-error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
        // 特定のフォームに特化したクリア処理 (例: 定期購入の候補追加部分)
        if (form.id === 'subscription-form') {
            const routeOptions = document.getElementById('route-options');
            while (routeOptions.children.length > 1) { // 最初の候補以外を削除
                routeOptions.removeChild(routeOptions.lastChild);
            }
        }
    }

    // --- ログイン画面 ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(loginForm)) {
            // ここで認証処理を実装 (今回はシミュレーション)
            console.log('ログイン成功 (シミュレーション)');
            alert('ログイン成功！');
            clearFormInputs(loginForm); // ログイン成功後フォームをクリア
            workflowSelect.value = ""; // ワークフロー選択をリセット
            showScreen('workflow'); // ワークフロー画面へ遷移
        } else {
            alert('入力に不備があります。');
        }
    });

    createAccountBtn.addEventListener('click', () => {
        clearFormInputs(createAccountForm); // 新規アカウント作成フォームをクリア
        showScreen('createAccount');
    });

    // --- 新規アカウント作成画面 ---
    createAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(createAccountForm)) {
            // ここでアカウント作成処理を実装 (今回はシミュレーション)
            console.log('アカウント作成成功 (シミュレーション)');
            alert('アカウントが作成されました！ログイン画面に戻ります。');
            clearFormInputs(createAccountForm); // 作成成功後フォームをクリア
            showScreen('login'); // ログイン画面へ遷移
        } else {
            alert('入力に不備があります。');
        }
    });

    backToLoginBtn.addEventListener('click', () => {
        clearFormInputs(createAccountForm); // フォームをクリア
        showScreen('login');
    });

    // --- ワークフロー画面 ---
    workflowSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.value;
        switch (selectedOption) {
            case 'subscription':
                clearFormInputs(subscriptionForm);
                showScreen('subscription');
                break;
            case 'monthlyDocument':
                clearFormInputs(monthlyDocumentForm);
                showScreen('monthlyDocument');
                break;
            case 'addressChange':
                clearFormInputs(addressChangeForm);
                showScreen('addressChange');
                break;
            default:
                // 何も選択されていない場合はワークフロー画面に留まる
                break;
        }
    });

    // 各画面からワークフローに戻るボタンのイベントリスナー
    backToWorkflowBtns.forEach(button => {
        button.addEventListener('click', () => {
            workflowSelect.value = ""; // ワークフロー選択をリセット
            showScreen('workflow');
        });
    });


    // --- 定期購入画面 ---
    let candidateCount = 1;
    addCandidateBtn.addEventListener('click', () => {
        candidateCount++;
        const routeOptions = document.getElementById('route-options');
        const newRouteOption = document.createElement('div');
        newRouteOption.classList.add('route-option');
        newRouteOption.innerHTML = `
            <h3>候補 ${candidateCount}</h3>
            <div class="form-group">
                <label for="transitStation${candidateCount}">経由駅:</label>
                <input type="text" id="transitStation${candidateCount}" name="transitStation[]">
            </div>
            <div class="form-group">
                <label for="commuteTime${candidateCount}">通勤時間:</label>
                <select id="commuteTime${candidateCount}" name="commuteTime[]" required>
                    <option value="">選択してください</option>
                    <option value="15分未満">15分未満</option>
                    <option value="15分-30分">15分-30分</option>
                    <option value="30分-1時間">30分-1時間</option>
                    <option value="1時間以上">1時間以上</option>
                </select>
                <div class="error-message" id="commuteTime${candidateCount}-error"></div>
            </div>
            <div class="form-group">
                <label for="amount${candidateCount}">金額:</label>
                <input type="number" id="amount${candidateCount}" name="amount[]" required>
                <div class="error-message" id="amount${candidateCount}-error"></div>
            </div>
        `;
        routeOptions.appendChild(newRouteOption);
    });

    subscriptionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(subscriptionForm)) {
            currentFormId = 'subscription-form';
            const formData = new FormData(subscriptionForm);
            let displayContent = '<h3>定期購入内容</h3>';
            // FormDataは同じname属性を持つものを全て取得するため、手動で処理を調整
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (key.endsWith('[]')) { // 配列形式の項目 (経由駅, 通勤時間, 金額)
                    const baseKey = key.replace('[]', '');
                    if (!data[baseKey]) {
                        data[baseKey] = [];
                    }
                    data[baseKey].push(value);
                } else {
                    data[key] = value;
                }
            }

            for (const key in data) {
                if (Array.isArray(data[key])) {
                    displayContent += `<p><strong>${key}:</strong></p><ul>`;
                    data[key].forEach(item => {
                        displayContent += `<li>${item}</li>`;
                    });
                    displayContent += `</ul>`;
                } else {
                    displayContent += `<p><strong>${key}:</strong> ${data[key]}</p>`;
                }
            }
            confirmationContent.innerHTML = displayContent;
            showScreen('confirmation');
        } else {
            alert('入力に不備があります。');
        }
    });

    // --- 月末書類画面 ---
    monthlyDocumentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(monthlyDocumentForm)) {
            currentFormId = 'monthly-document-form';
            const submissionDate = document.getElementById('submissionDate').value;
            const attachmentFile = document.getElementById('attachmentFile').files[0];

            let displayContent = '<h3>月末書類内容</h3>';
            displayContent += `<p><strong>提出日:</strong> ${submissionDate}</p>`;
            displayContent += `<p><strong>添付ファイル:</strong> ${attachmentFile ? attachmentFile.name : 'なし'}</p>`;
            confirmationContent.innerHTML = displayContent;
            showScreen('confirmation');
        } else {
            alert('入力に不備があります。');
        }
    });

    // --- 住所変更画面 ---
    searchZipCodeBtn.addEventListener('click', async () => {
        const zipCodeInput = document.getElementById('zipCode');
        const newAddressInput = document.getElementById('newAddress');
        const zipCodeError = document.getElementById('zipCode-error');
        const zipCode = zipCodeInput.value.replace(/[^0-9]/g, ''); // ハイフンを除去

        if (zipCode.length !== 7) {
            zipCodeError.textContent = '郵便番号は7桁で入力してください。';
            return;
        } else {
            zipCodeError.textContent = '';
        }

        try {
            // 郵便番号検索APIの利用 (例: 地方公共団体情報システム機構のAPIなど)
            // https://zipcloud.ibsnet.co.jp/api/search?zipcode=XXX
            const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const address = data.results[0];
                newAddressInput.value = `${address.address1}${address.address2}${address.address3}`;
            } else {
                newAddressInput.value = '';
                alert('該当する住所が見つかりませんでした。');
            }
        } catch (error) {
            console.error('郵便番号検索エラー:', error);
            alert('郵便番号検索中にエラーが発生しました。');
            newAddressInput.value = '';
        }
    });

    addressChangeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(addressChangeForm)) {
            currentFormId = 'address-change-form';
            const formData = new FormData(addressChangeForm);
            let displayContent = '<h3>住所変更内容</h3>';
            for (let [key, value] of formData.entries()) {
                if (key !== 'attachmentFile') { // ファイルは確認画面で表示しない
                     displayContent += `<p><strong>${key}:</strong> ${value}</p>`;
                }
            }
            confirmationContent.innerHTML = displayContent;
            showScreen('confirmation');
        } else {
            alert('入力に不備があります。');
        }
    });

    // --- 送信確認画面 ---
    backToFormBtn.addEventListener('click', () => {
        let targetFormScreenId;
        switch (currentFormId) {
            case 'subscription-form':
                targetFormScreenId = 'subscription';
                break;
            case 'monthly-document-form':
                targetFormScreenId = 'monthlyDocument';
                break;
            case 'address-change-form':
                targetFormScreenId = 'addressChange';
                break;
            default:
                targetFormScreenId = 'workflow'; // デフォルトまたはエラーハンドリング
        }
        showScreen(targetFormScreenId);
    });

    submitFinalBtn.addEventListener('click', () => {
        alert('データを最終送信しました！ (今回はシミュレーション)');
        // ここで実際のデータ送信処理（API連携など）を実装
        // 送信後、どの画面に戻るか、または完了画面に遷移するかを決定
        clearFormInputs(document.getElementById(currentFormId)); // 送信後、元のフォームをクリア
        workflowSelect.value = ""; // ワークフロー選択をリセット
        showScreen('workflow'); // ワークフロー画面に戻る例
    });
});