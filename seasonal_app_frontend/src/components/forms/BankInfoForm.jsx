/**
 * Bank Information Form
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Input } from '../ui';
import { saveBankInfo, previousStep, nextStep } from '../../store/slices/profileSlice';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const IBANInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.info}10;
  border-left: 4px solid ${({ theme }) => theme.colors.info};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

// IBAN validation function
const validateIBAN = (iban) => {
  if (!iban) return true; // Optional field
  // Basic IBAN validation: 15-34 characters, alphanumeric
  const ibanRegex = /^[A-Z0-9]{15,34}$/i;
  return ibanRegex.test(iban.replace(/\s/g, '')) || 'Invalid IBAN format (15-34 characters)';
};

const BankInfoForm = () => {
  const dispatch = useDispatch();
  const { bankInfo, loading } = useSelector(state => state.profile);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const ibanValue = watch('iban');

  useEffect(() => {
    if (bankInfo) {
      Object.keys(bankInfo).forEach(key => {
        if (bankInfo[key]) {
          setValue(key, bankInfo[key]);
        }
      });
    }
  }, [bankInfo, setValue]);

  const onSubmit = async (data) => {
    await dispatch(saveBankInfo(data));
    // Navigate to next step after successful save
    setTimeout(() => {
      dispatch(nextStep());
    }, 500);
  };

  // Format IBAN with spaces for better readability
  const formatIBAN = (value) => {
    if (!value) return '';
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <Input
            label="Bank Name"
            {...register('bank_name', { required: 'Bank name is required' })}
            error={errors.bank_name?.message}
            placeholder="e.g., Emirates NBD"
          />
        </FormRow>

        <FormRow>
          <Input
            label="Account Holder Name"
            {...register('account_holder_name', { required: 'Account holder name is required' })}
            error={errors.account_holder_name?.message}
            placeholder="Full name as on bank account"
          />
        </FormRow>

        <div>
          <Input
            label="IBAN"
            {...register('iban', { 
              validate: validateIBAN,
              onChange: (e) => {
              // Auto-format IBAN
              const formatted = formatIBAN(e.target.value);
              setValue('iban', formatted, { shouldValidate: true });
            }})}
            error={errors.iban?.message}
            placeholder="AE07 0331 2345 6789 0123 456"
            maxLength={42} // 34 chars + spaces
          />
          <IBANInfo>
            <strong>IBAN Format:</strong> 15-34 alphanumeric characters. 
            Example: AE070331234567890123456
          </IBANInfo>
        </div>

        <NavigationButtons>
          <Button type="button" variant="outline" onClick={() => dispatch(previousStep())}>
            Previous
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </NavigationButtons>
      </form>
    </FormContainer>
  );
};

export default BankInfoForm;

