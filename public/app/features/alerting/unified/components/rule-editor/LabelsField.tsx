import React, { FC } from 'react';
import { Button, Field, FieldArray, Input, InlineLabel, Label, useStyles } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { css, cx } from '@emotion/css';
import { useFormContext } from 'react-hook-form';

interface Props {
  className?: string;
}

const LabelsField: FC<Props> = ({ className }) => {
  const styles = useStyles(getStyles);
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const labels = watch('labels');
  return (
    <div className={cx(className, styles.wrapper)}>
      <Label>Custom Labels</Label>
      <FieldArray control={control} name="labels">
        {({ fields, append, remove }) => {
          return (
            <>
              <div className={styles.flexRow}>
                <InlineLabel width={15}>Labels</InlineLabel>
                <div className={styles.flexColumn}>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.id}>
                        <div className={cx(styles.flexRow, styles.centerAlignRow)}>
                          <Field
                            className={styles.labelInput}
                            invalid={!!errors.labels?.[index]?.key?.message}
                            error={errors.labels?.[index]?.key?.message}
                          >
                            <Input
                              {...register(`labels[${index}].key`, {
                                required: { value: !!labels[index]?.value, message: 'Required.' },
                              })}
                              placeholder="key"
                              defaultValue={field.key}
                            />
                          </Field>
                          <InlineLabel className={styles.equalSign}>=</InlineLabel>
                          <Field
                            className={styles.labelInput}
                            invalid={!!errors.labels?.[index]?.value?.message}
                            error={errors.labels?.[index]?.value?.message}
                          >
                            <Input
                              {...register(`labels[${index}].value`, {
                                required: { value: !!labels[index]?.key, message: 'Required.' },
                              })}
                              placeholder="value"
                              defaultValue={field.value}
                            />
                          </Field>
                          <Button
                            className={styles.deleteLabelButton}
                            aria-label="delete label"
                            icon="trash-alt"
                            variant="secondary"
                            onClick={() => {
                              remove(index);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    className={styles.addLabelButton}
                    icon="plus-circle"
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      append({});
                    }}
                  >
                    Add label
                  </Button>
                </div>
              </div>
            </>
          );
        }}
      </FieldArray>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme) => {
  return {
    wrapper: css`
      margin-top: ${theme.spacing.md};
    `,
    flexColumn: css`
      display: flex;
      flex-direction: column;
    `,
    flexRow: css`
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      & + button {
        margin-left: ${theme.spacing.xs};
      }
    `,
    deleteLabelButton: css`
      margin-left: ${theme.spacing.xs};
      align-self: flex-start;
    `,
    addLabelButton: css`
      flex-grow: 0;
      align-self: flex-start;
    `,
    centerAlignRow: css`
      align-items: baseline;
    `,
    equalSign: css`
      align-self: flex-start;
      width: 28px;
      justify-content: center;
      margin-left: ${theme.spacing.xs};
    `,
    labelInput: css`
      width: 207px;
      margin-bottom: ${theme.spacing.sm};
      & + & {
        margin-left: ${theme.spacing.sm};
      }
    `,
  };
};

export default LabelsField;
