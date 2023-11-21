export const extractQuestions = (componentCode: any) => {
  const questions = [];
  const isWebflowObject = detectQuestionsComponent(componentCode);

  if (isWebflowObject === true) {
    const componentObject = JSON.parse(componentCode);

    componentObject.payload.nodes.forEach((node: any) => {
      const formlyAttrPresent = node?.data?.xattr?.filter(
        (attr) => attr.name === "data-form" && attr.value === "step"
      );

      if (formlyAttrPresent && formlyAttrPresent.length > 0) {
        const children = node.children;
        const question = traverseFindFormLabels(children, componentObject);
        const id = node._id;
        const childId = children[0];
        const radioChoices = traverseFindRadioComponent(
          children,
          componentObject
        );

        questions.push({ question, id, radioChoices });
      }
    });
  }

  return questions;
};

export const detectQuestionsComponent = (componentCode: any) => {
  if (!isJSON(componentCode)) {
    return "Not a valid component";
  } else {
    const componentObject = JSON.parse(componentCode);
    if (!isWFObject(componentObject)) {
      return "Not a valid webflow component";
    }
    let formlyAttr = "data-form";
    let formlySmallValue = "multistep";
    let formly = { formlyAttr, formlySmallValue };

    if (!hasFormlyAttributes(componentObject, formly)) {
      return `This component does not have the formly ${formlySmallValue} attribute.`;
    }

    formlyAttr = "data-form";
    formlySmallValue = "step";
    formly = { formlyAttr, formlySmallValue };

    if (!hasFormlyAttributes(componentObject, formly)) {
      return "This compnent does not have formly step attribute";
    }

    return true;
  }
};

const isJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const isWFObject = (obj) =>
  "type" in obj && obj["type"] === "@webflow/XscpData" && "payload" in obj;

const hasFormlyAttributes = (obj: any, formly: any) => {
  let result = false;

  obj.payload.nodes.forEach((node: any) => {
    node?.data?.xattr?.forEach((attr) => {
      if (
        attr.name === formly.formlyAttr &&
        attr.value === formly.formlySmallValue
      ) {
        result = true;
      }
    });
  });

  return result;
};

const traverseComponent = (childrenIds: string, componentObject: any) => {
  if (childrenIds.length === 0) return "Example question";

  // find node ids
  const childNodes = componentObject.payload.nodes.filter((node: any) =>
    childrenIds.includes(node._id)
  );
  if (childNodes.length === 0) {
    return "Example question";
  }
  // find text nodes
  const textNode = childNodes.find((node) => node.v && node.text === true);

  // if no text nodes get new traverse else return text node.
  if (!textNode) {
    const newChildrenIds = childNodes.flatMap(
      (childNode) => childNode.children
    );
    return traverseComponent(newChildrenIds, componentObject);
  } else {
    return textNode.v;
  }
};

const traverseFindRadioComponent = (
  childrenIds: string,
  componentObject: any,
  radioValues = []
) => {
  if (childrenIds.length === 0) return radioValues;

  // find node ids
  const childNodes = componentObject.payload.nodes.filter((node: any) =>
    childrenIds.includes(node._id)
  );
  if (childNodes.length === 0) {
    return radioValues;
  }
  // find radio label nodes
  const radioNodes = childNodes.filter(
    (node) => node.type === "FormRadioInput"
  );

  const radioNodesLabels = childNodes.filter(
    (node) => node.type === "FormInlineLabel"
  );

  radioValues.push(
    ...radioNodes.flatMap((node, index) => {
      const text = traverseComponent(
        radioNodesLabels[index].children[0],
        componentObject
      );
      return { text, id: node._id };
    })
  );

  const newChildrenIds = childNodes.flatMap((childNode) => childNode.children);

  return traverseFindRadioComponent(
    newChildrenIds,
    componentObject,
    radioValues
  );
};

const traverseFindFormLabels = (
  childrenIds: string,
  componentObject: any,
  radioValues = []
) => {
  if (childrenIds.length === 0) return radioValues;

  // find node ids
  const childNodes = componentObject.payload.nodes.filter((node: any) =>
    childrenIds.includes(node._id)
  );
  if (childNodes.length === 0) {
    return radioValues;
  }
  // find radio label nodes
  const radioNodes = childNodes.filter(
    (node) => node.type === "FormBlockLabel"
  );
  radioValues.push(
    ...radioNodes.flatMap((node) => {
      return getWFTextGivenIds(node.children, componentObject.payload.nodes);
    })
  );

  const newChildrenIds = childNodes.flatMap((childNode) => childNode.children);

  return traverseFindFormLabels(newChildrenIds, componentObject, radioValues);
};

export const transverseDOM = (dom: DOMElement, elements = []) => {
  if (dom.children) {
    let children = dom.getChildren();
    elements.push(...children);

    children.forEach((child) => {
      return transverseDOM(child as DOMElement, elements);
    });
  }
  return elements;
};

export const getWFElementById = async (id: string, allElements: any[]) => {
  return allElements.find((d) => d.id === id);
};

export const getWFChildElementById = async (id: string, allElements: any[]) => {
  const parent = allElements.find((d) => d.id === id);
  const child = parent.getChildren()[0];
  return child;
};

const getWFTextGivenIds = (ids: string, allElements: any[]) => {
  let nodetext = "";
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    const text = allElements.find((d) => d._id === id);
    if (text && text.v) {
      nodetext += text.v;
    }
  }

  return nodetext;
};
