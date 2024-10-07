import React, { useEffect, useState } from 'react';
import Type from './Type';

const DamageRelations = ({ damages }) => {
  //   console.log(damages);

  const [damagePokemonForm, setDamagePokemonForm] = useState();

  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      separateObjectBetweenToAndFrom(damage)
    );

    // console.log('arrayDamage: ', arrayDamage);
    if (arrayDamage.length === 2) {
      // 합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }
  }, []);

  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, 'to'),
      from: joinObjects(props, 'from'),
    };
  };

  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: '4x',
      half_damage: '1/4x',
      no_damage: '0x',
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;
      // console.log([keyName, value]);
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);

      return (acc = { [keyName]: verifiedValue, ...acc });
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    // console.log('valueForFiltering: ', valueForFiltering);
    // console.log('damageValue: ', damageValue);

    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      // console.log(url, name);
      const filterACC = acc.filter((a) => a.name !== name);

      return filterACC.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
    }, []);
  };

  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];
    // console.log('props', props);
    // console.log('firstArrayValue: ', firstArrayValue);
    // console.log('secondArrayValue: ', secondArrayValue);

    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]) => {
        // console.log(acc, [keyName, value]);

        const result = firstArrayValue[keyName].concat(value);

        return (acc = { [keyName]: result, ...acc });
      },
      {}
    );

    return result;
  };

  const postDamageValue = (props) => {
    // console.log(Object.entries(props));
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;

      const valuesOfKeyName = {
        double_damage: '2x',
        half_damage: '1/2x',
        no_damage: '0x',
      };

      return (acc = {
        [keyName]: value.map((i) => ({
          damageValue: valuesOfKeyName[key],
          ...i,
        })),
        ...acc,
      });
    }, {});

    // console.log('result: ', result);
    return result;
  };

  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations('_from', damage);
    // console.log('from: ', from);
    const to = filterDamageRelations('_to', damage);
    // console.log('to: ', to);

    return { from, to };
  };

  const filterDamageRelations = (valueFilter, dagame) => {
    const result = Object.entries(dagame)
      .filter(([keyName, value]) => {
        // console.log('keyName: ', keyName);
        // console.log('value: ', value);
        return keyName.includes(valueFilter);
      })
      .reduce((acc, [keyName, value]) => {
        const keyWithValueFilterRemove = keyName.replace(valueFilter, '');
        // console.log('acc: ', acc);
        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
      }, {});

    return result;
  };

  return (
    <div className="flex gap-2 flex-col w-full">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]) => {
            const key = keyName;
            const valuesOfKeyName = {
              double_damage: 'Weak',
              half_damage: 'Resistant',
              no_damage: 'Immune',
            };

            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                  {valuesOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }) => {
                      return (
                        <Type type={name} key={url} damageValue={damageValue} />
                      );
                    })
                  ) : (
                    <Type type={'none'} key={'none'} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;
