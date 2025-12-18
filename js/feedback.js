// Feedback Form - Validation & Submission

class FeedbackForm {
    constructor() {
        this.form = document.getElementById('feedbackForm');
        this.successMessage = document.getElementById('formSuccess');
        
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: false,
                pattern: /^[0-9]{10,11}$/
            },
            rating: {
                required: true
            },
            message: {
                required: true,
                minLength: 10
            }
        };

        this.init();
    }

    init() {
        if (!this.form) return;

        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'radio' && input.type !== 'checkbox') {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            }
        });

        // Validate radio buttons
        const ratingInputs = this.form.querySelectorAll('input[name="rating"]');
        ratingInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.validateField(input, 'rating');
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(field, fieldName = null) {
        const name = fieldName || field.name;
        const rules = this.validationRules[name];
        
        if (!rules) return true;

        let isValid = true;
        let errorMessage = '';

        // Check required
        if (rules.required) {
            if (field.type === 'radio') {
                const checked = this.form.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    isValid = false;
                    errorMessage = '请选择满意度评分';
                }
            } else {
                const value = field.value.trim();
                if (!value) {
                    isValid = false;
                    errorMessage = '此字段为必填项';
                }
            }
        }

        // Check pattern
        if (isValid && rules.pattern && field.value) {
            if (!rules.pattern.test(field.value.trim())) {
                isValid = false;
                errorMessage = this.getPatternErrorMessage(name);
            }
        }

        // Check min length
        if (isValid && rules.minLength && field.value) {
            if (field.value.trim().length < rules.minLength) {
                isValid = false;
                errorMessage = `至少需要${rules.minLength}个字符`;
            }
        }

        // Special validations
        if (isValid) {
            isValid = this.validateSpecialCases(name, field);
            if (!isValid) {
                errorMessage = this.getSpecialErrorMessage(name);
            }
        }

        this.displayError(name, isValid, errorMessage);
        return isValid;
    }

    validateSpecialCases(name, field) {
        switch (name) {
            case 'name':
                const nameValue = field.value.trim();
                if (nameValue.length < 2) {
                    return false;
                }
                if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(nameValue)) {
                    return false;
                }
                break;
            case 'message':
                if (field.value.trim().length < 10) {
                    return false;
                }
                break;
        }
        return true;
    }

    getPatternErrorMessage(name) {
        const messages = {
            name: '姓名只能包含中文、英文字母和空格',
            email: '请输入有效的邮箱地址',
            phone: '请输入10-11位数字的电话号码'
        };
        return messages[name] || '格式不正确';
    }

    getSpecialErrorMessage(name) {
        const messages = {
            name: '姓名至少需要2个字符',
            message: '反馈内容至少需要10个字符'
        };
        return messages[name] || '验证失败';
    }

    displayError(fieldName, isValid, errorMessage) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (!field || !errorElement) return;

        if (isValid) {
            field.classList.remove('invalid');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else {
            field.classList.add('invalid');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
    }

    clearError(field) {
        if (field.classList.contains('invalid')) {
            field.classList.remove('invalid');
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        }
    }

    validateAllFields() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate rating separately
        const ratingChecked = this.form.querySelector('input[name="rating"]:checked');
        if (!ratingChecked) {
            this.displayError('rating', false, '请选择满意度评分');
            isValid = false;
        }

        // Validate optional fields if filled
        const phone = this.form.querySelector('[name="phone"]');
        if (phone && phone.value) {
            if (!this.validateField(phone)) {
                isValid = false;
            }
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateAllFields()) {
            // Scroll to first error
            const firstError = this.form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '未提供',
            product: formData.get('product') || '未选择',
            rating: formData.get('rating'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            timestamp: new Date().toISOString()
        };

        // Simulate form submission
        try {
            // In a real application, you would send this to a server
            console.log('Form submitted:', data);
            
            // Show success message
            this.showSuccess();
            
            // Reset form
            setTimeout(() => {
                this.form.reset();
                this.successMessage.style.display = 'none';
            }, 3000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('提交失败，请稍后重试。');
        }
    }

    showSuccess() {
        if (this.successMessage) {
            this.successMessage.style.display = 'block';
            this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset all error states
            const invalidFields = this.form.querySelectorAll('.invalid');
            invalidFields.forEach(field => {
                field.classList.remove('invalid');
            });
            
            const errorMessages = this.form.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                msg.textContent = '';
                msg.style.display = 'none';
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('feedbackForm')) {
        new FeedbackForm();
    }
});
