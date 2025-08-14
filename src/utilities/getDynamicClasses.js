
import classNames from 'classnames';

export const getDynamicClasses = (baseClass, step, classesByStep) => {
    return classNames(
        baseClass,
        ...Object.entries(classesByStep).flatMap(([conditionStep, className]) => {
            if (step === parseInt(conditionStep)) {
                return ['👉', className];
            } else if (step > parseInt(conditionStep)) {
                return [className];
            }
            return [];
        })
    );
};